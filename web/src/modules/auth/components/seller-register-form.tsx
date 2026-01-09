"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sellerRegisterSchema } from "../validation/seller-register-schema";
import { useSellerRegister } from "../hooks/use-auth";
import Link from "next/link";
import "./register-form.css";
import type * as z from "zod";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { useLanguage } from "@/hooks/LanguageContext";

type SellerRegisterFormData = z.infer<typeof sellerRegisterSchema>;

export function SellerRegisterForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const { mutate: register, isPending } = useSellerRegister();
  const [registrationError, setRegistrationError] = useState<string | null>(
    null
  );
  const [isSuccess, setIsSuccess] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const [map, setMap] = useState<google.maps.Map | null>(null);
  // const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  // const [isMapLoaded, setIsMapLoaded] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SellerRegisterFormData>({
    resolver: zodResolver(sellerRegisterSchema),
    mode: "onChange",
    defaultValues: {
      agreeToPrivacyPolicy: false,
      agreeToSellerAgreement: false,
      agreeToTerms: false,
    },
  });

  const allAgreed =
    !!watch("agreeToPrivacyPolicy") &&
    !!watch("agreeToSellerAgreement") &&
    !!watch("agreeToTerms");

  // Watch storeName to auto-generate slug
  const storeName = watch("storeName");
  const storeSlug = watch("storeSlug");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [slugCheckResult, setSlugCheckResult] = useState<{
    available: boolean;
    suggestedSlug: string | null;
    checking: boolean;
  }>({ available: true, suggestedSlug: null, checking: false });
  const slugCheckTimeout = useRef<NodeJS.Timeout | null>(null);

  // Function to generate slug from name
  const generateSlugFromName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single
      .trim()
      .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
  };

  // Check slug availability
  const checkSlugAvailability = async (slug: string) => {
    if (!slug || slug.length < 3) {
      setSlugCheckResult({
        available: false,
        suggestedSlug: null,
        checking: false,
      });
      return;
    }

    setSlugCheckResult((prev) => ({ ...prev, checking: true }));

    try {
      const response = await fetch(
        `/api/stores/check-slug?slug=${encodeURIComponent(slug)}`
      );
      const data = await response.json();

      setSlugCheckResult({
        available: data.available,
        suggestedSlug: data.suggestedSlug,
        checking: false,
      });

      // If not available and we have a suggestion, auto-fill it
      if (!data.available && data.suggestedSlug && !slugManuallyEdited) {
        setValue("storeSlug", data.suggestedSlug);
      }
    } catch (error) {
      console.error("Error checking slug:", error);
      setSlugCheckResult({
        available: true,
        suggestedSlug: null,
        checking: false,
      });
    }
  };

  // Auto-generate slug from storeName
  useEffect(() => {
    if (storeName && !slugManuallyEdited) {
      const generatedSlug = generateSlugFromName(storeName);
      setValue("storeSlug", generatedSlug);
    }
  }, [storeName, slugManuallyEdited, setValue]);

  // Check slug availability when it changes
  useEffect(() => {
    if (storeSlug && storeSlug.length >= 3) {
      // Debounce the check
      if (slugCheckTimeout.current) {
        clearTimeout(slugCheckTimeout.current);
      }
      slugCheckTimeout.current = setTimeout(() => {
        checkSlugAvailability(storeSlug);
      }, 500);
    }

    return () => {
      if (slugCheckTimeout.current) {
        clearTimeout(slugCheckTimeout.current);
      }
    };
  }, [storeSlug]);

  // const [addressTimeout, setAddressTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (e.target?.result) {
          setLogoPreview(e.target.result as string);
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  const onSubmit = handleSubmit((data) => {
    setRegistrationError(null);

    // Create FormData to handle file uploads
    const formData = new FormData();

    // Add all form fields to FormData, excluding agreement checkboxes
    Object.entries(data).forEach(([key, value]) => {
      if (
        value !== undefined &&
        key !== "agreeToPrivacyPolicy" &&
        key !== "agreeToSellerAgreement" &&
        key !== "agreeToTerms"
      ) {
        formData.append(key, value as string);
      }
    });

    // Add the logo file if it exists
    if (fileInputRef.current?.files?.length) {
      formData.append("logoFile", fileInputRef.current.files[0]);
    }

    register(formData, {
      onSuccess: (response) => {
        // Store tokens in localStorage
        if (response.tokens) {
          localStorage.setItem("accessToken", response.tokens.accessToken);
          localStorage.setItem("refreshToken", response.tokens.refreshToken);
        }

        setIsSuccess(true);
        toast({
          title: t("auth.registrationSuccessful"),
          description: t("auth.sellerAccountCreatedSuccessfully"),
          variant: "default",
        });

        // Redirect to profile page after 2 seconds
        setTimeout(() => {
          router.push("/profile");
        }, 2000);
      },
      onError: (error) => {
        // Display the error message directly from the backend
        const errorMessage = error.message;
        setRegistrationError(errorMessage);

        toast({
          title: t("auth.registrationFailed"),
          description: errorMessage,
          variant: "destructive",
        });
      },
    });
  });

  // const handleAddressChange = (address: string) => {
  //   if (!window.google || !window.google.maps) return;

  //   // Clear previous timeout
  //   if (addressTimeout) {
  //     clearTimeout(addressTimeout);
  //   }

  //   // Set new timeout for debounced geocoding
  //   const timeout = setTimeout(() => {
  //     const geocoder = new google.maps.Geocoder();
  //     geocoder.geocode({ address }, (results, status) => {
  //       if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
  //         const location = results[0].geometry.location;
  //         const lat = location.lat();
  //         const lng = location.lng();

  //         setValue("storeLocation", { lat, lng });

  //         // Update map and marker if they exist
  //         if (map && marker) {
  //           map.setCenter({ lat, lng });
  //           marker.setPosition({ lat, lng });
  //         }
  //       }
  //     });
  //   }, 1000); // 1 second delay

  //   setAddressTimeout(timeout);
  // };

  // Cleanup timeout on unmount
  // useEffect(() => {
  //   return () => {
  //     if (addressTimeout) {
  //       clearTimeout(addressTimeout);
  //     }
  //   };
  // }, [addressTimeout]);

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Initialize Google Maps
  // useEffect(() => {
  //   const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  //   if (!apiKey) {
  //     console.error("Google Maps API key not found");
  //     return;
  //   }

  //   // Check if Google Maps is already loaded
  //   if (window.google && window.google.maps) {
  //     initializeMap();
  //     return;
  //   }

  //   // Check if script is already loading
  //   if (document.querySelector('script[src*="maps.googleapis.com"]')) {
  //     return;
  //   }

  //   // Define initMap function globally
  //   window.initMap = initializeMap;

  //   // Load Google Maps script
  //   const script = document.createElement("script");
  //   script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=places`;
  //   script.async = true;
  //   script.defer = true;
  //   document.head.appendChild(script);

  //   function initializeMap() {
  //     try {
  //       console.log("Initializing Google Maps...");
  //       console.log("Google Maps API available:", !!window.google?.maps);
  //       const mapElement = document.getElementById("location-map");
  //       if (!mapElement) {
  //         console.error("Map element not found");
  //         return;
  //       }

  //       const googleMap = new google.maps.Map(mapElement, {
  //         center: { lat: 41.7167, lng: 44.7833 }, // Tbilisi center
  //         zoom: 12,
  //       });

  //       console.log("Google Maps initialized successfully");

  //       const mapMarker = new google.maps.Marker({
  //         position: { lat: 41.7167, lng: 44.7833 },
  //         map: googleMap,
  //         draggable: true,
  //       });

  //       googleMap.addListener("click", (event: google.maps.MapMouseEvent) => {
  //         if (event.latLng) {
  //           console.log("Map clicked:", event.latLng.lat(), event.latLng.lng());
  //           mapMarker.setPosition(event.latLng);
  //           const lat = event.latLng.lat();
  //           const lng = event.latLng.lng();

  //           setValue("storeLocation", {
  //             lat,
  //             lng,
  //           });

  //           // Reverse geocode to get address
  //           const geocoder = new google.maps.Geocoder();
  //           geocoder.geocode({ location: { lat, lng } }, (results, status) => {
  //             if (
  //               status === google.maps.GeocoderStatus.OK &&
  //               results &&
  //               results[0]
  //             ) {
  //               console.log(
  //                 "Reverse geocoding result:",
  //                 results[0].formatted_address
  //               );
  //               setValue("storeAddress", results[0].formatted_address);
  //             } else {
  //               console.error("Reverse geocoding failed:", status);
  //             }
  //           });
  //         }
  //       });

  //       mapMarker.addListener("dragend", (event: google.maps.MapMouseEvent) => {
  //         if (event.latLng) {
  //           console.log(
  //             "Marker dragged:",
  //             event.latLng.lat(),
  //             event.latLng.lng()
  //           );
  //           const lat = event.latLng.lat();
  //           const lng = event.latLng.lng();

  //           setValue("storeLocation", {
  //             lat,
  //             lng,
  //           });

  //           // Reverse geocode to get address
  //           const geocoder = new google.maps.Geocoder();
  //           geocoder.geocode({ location: { lat, lng } }, (results, status) => {
  //             if (
  //               status === google.maps.GeocoderStatus.OK &&
  //               results &&
  //               results[0]
  //             ) {
  //               console.log(
  //                 "Reverse geocoding result:",
  //                 results[0].formatted_address
  //               );
  //               setValue("storeAddress", results[0].formatted_address);
  //             } else {
  //               console.error("Reverse geocoding failed:", status);
  //             }
  //           });
  //         }
  //       });
  //       setMap(googleMap);
  //       setMarker(mapMarker);
  //       setIsMapLoaded(true);
  //       console.log("Map initialization complete");
  //     } catch (error) {
  //       console.error("Error initializing Google Maps:", error);
  //     }
  //   }
  // }, []);

  if (isSuccess) {
    return (
      <div className="form-container">
        <div className="success-message">
          <h3>{t("auth.registrationSuccessful")}</h3>
          <p>{t("auth.sellerAccountCreatedSuccessfully")}</p>
          <p>{t("auth.redirectingToLogin")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container" id="seller-register-form">
      <form onSubmit={onSubmit} className="form">
        <div className="input-group">
          <label htmlFor="storeName">{t("auth.companyName")}</label>
          <input
            id="storeName"
            type="text"
            placeholder={t("auth.enterCompanyName")}
            {...registerField("storeName")}
          />
          {errors.storeName && (
            <p className="error-text">{errors.storeName.message}</p>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="storeSlug">{t("auth.storeSlug")}</label>
          <div className="slug-input-container">
            <span className="slug-prefix">fishhunt.ge/store/</span>
            <input
              id="storeSlug"
              type="text"
              placeholder={t("auth.enterStoreSlug")}
              {...registerField("storeSlug", {
                onChange: () => setSlugManuallyEdited(true),
              })}
            />
            {slugCheckResult.checking && (
              <span className="slug-status slug-checking">⏳</span>
            )}
            {!slugCheckResult.checking &&
              storeSlug &&
              storeSlug.length >= 3 && (
                <span
                  className={`slug-status ${
                    slugCheckResult.available ? "slug-available" : "slug-taken"
                  }`}
                >
                  {slugCheckResult.available ? "✓" : "✗"}
                </span>
              )}
          </div>
          {errors.storeSlug && (
            <p className="error-text">{errors.storeSlug.message}</p>
          )}
          {!slugCheckResult.available &&
            slugCheckResult.suggestedSlug &&
            storeSlug !== slugCheckResult.suggestedSlug && (
              <p className="slug-suggestion">
                {t("auth.slugTaken")}
                <button
                  type="button"
                  className="slug-suggestion-link"
                  onClick={() => {
                    setValue("storeSlug", slugCheckResult.suggestedSlug!);
                    setSlugManuallyEdited(false);
                  }}
                >
                  {slugCheckResult.suggestedSlug}
                </button>
              </p>
            )}
          <p className="hint-text">{t("auth.storeSlugHint")}</p>
        </div>

        <div className="input-group">
          <label htmlFor="logoFile">{t("auth.uploadLogo")}</label>
          <div className="logo-upload-container">
            {logoPreview && (
              <div className="logo-preview">
                <Image
                  src={logoPreview}
                  alt={t("auth.logoPreview")}
                  width={100}
                  height={100}
                  className="logo-preview-image"
                />
              </div>
            )}
            <input
              ref={fileInputRef}
              id="logoFile"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="file-input"
              style={{ display: "none" }}
            />
            <button
              type="button"
              onClick={triggerFileInput}
              className="logo-upload-button"
            >
              {logoPreview ? t("auth.changeLogo") : t("auth.uploadLogo")}
            </button>
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="storeAddress">{t("auth.storeAddress")}</label>
          <input
            id="storeAddress"
            type="text"
            placeholder={t("auth.enterStoreAddress")}
            {...registerField("storeAddress")}
            // onChange={(e) => {
            //   registerField("storeAddress").onChange(e);
            //   handleAddressChange(e.target.value);
            // }}
          />
          {errors.storeAddress && (
            <p className="error-text">{errors.storeAddress.message}</p>
          )}
          <p className="hint-text">{t("auth.storeAddressHint")}</p>
        </div>

        {/* <div className="input-group">
          <label>{t("auth.storeLocation")}</label>
          <div className="location-picker-container">
            {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
              <>
                <div id="location-map" className="location-map"></div>
                <p className="hint-text">{t("auth.clickOnMap")}</p>
              </>
            ) : (
              <div className="map-placeholder">
                <p className="error-text">რუკა არ არის ხელმისაწვდომი</p>
                <p className="hint-text">
                  Google Maps API გასაღები არ არის კონფიგურირებული
                </p>
                <p className="hint-text">
                  დაამატეთ NEXT_PUBLIC_GOOGLE_MAPS_API_KEY .env.local ფაილში
                </p>
                <p className="hint-text">
                  მიიღეთ API გასაღები{" "}
                  <a
                    href="https://console.cloud.google.com/google/maps-apis"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Cloud Console-დან
                  </a>
                </p>
              </div>
            )}
            {watch("storeLocation") && (
              <p className="location-coords">
                {t("auth.selectedLocation")}:{" "}
                {watch("storeLocation")?.lat.toFixed(6)},{" "}
                {watch("storeLocation")?.lng.toFixed(6)}
              </p>
            )}
          </div>
        </div> */}

        <div className="input-group">
          <label htmlFor="ownerFirstName">{t("auth.firstName")}</label>
          <input
            id="ownerFirstName"
            type="text"
            placeholder={t("auth.enterFirstName")}
            {...registerField("ownerFirstName")}
          />
          {errors.ownerFirstName && (
            <p className="error-text">{errors.ownerFirstName.message}</p>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="ownerLastName">{t("auth.lastName")}</label>
          <input
            id="ownerLastName"
            type="text"
            placeholder={t("auth.enterLastName")}
            {...registerField("ownerLastName")}
          />
          {errors.ownerLastName && (
            <p className="error-text">{errors.ownerLastName.message}</p>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="phoneNumber">{t("auth.phoneNumber")}</label>
          <input
            id="phoneNumber"
            type="tel"
            placeholder="+995555123456"
            {...registerField("phoneNumber")}
          />
          {errors.phoneNumber && (
            <p className="error-text">{errors.phoneNumber.message}</p>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="email">{t("auth.email")}</label>
          <input
            id="email"
            type="email"
            placeholder="name@example.com"
            {...registerField("email")}
          />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="password">{t("auth.password")}</label>
          <input
            id="password"
            type="password"
            placeholder="********"
            {...registerField("password")}
          />
          {errors.password && (
            <p className="error-text">{errors.password.message}</p>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="identificationNumber">{t("auth.idNumber")}</label>
          <input
            id="identificationNumber"
            type="text"
            placeholder={t("auth.enterIdNumber")}
            {...registerField("identificationNumber")}
          />
          {errors.identificationNumber && (
            <p className="error-text">{errors.identificationNumber.message}</p>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="accountNumber">{t("auth.accountNumber")}</label>
          <input
            id="accountNumber"
            type="text"
            placeholder="GE29TB7777777777777777"
            {...registerField("accountNumber")}
          />
          {errors.accountNumber && (
            <p className="error-text">{errors.accountNumber.message}</p>
          )}
        </div>

        {/* Enhanced error message display */}
        {registrationError && (
          <div className="error-message">
            <p className="error-text">{registrationError}</p>
          </div>
        )}

        {/* Required agreement checkboxes */}
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input type="checkbox" {...registerField("agreeToPrivacyPolicy")} />
            <span>
              {t("auth.agreeToPrivacyPolicy")}
              <Link href="/privacy-policy">{t("auth.privacyPolicy")}</Link>
            </span>
          </label>
          {errors.agreeToPrivacyPolicy && (
            <p className="error-text">{errors.agreeToPrivacyPolicy.message}</p>
          )}

          <label className="checkbox-label">
            <input
              type="checkbox"
              {...registerField("agreeToSellerAgreement")}
            />
            <span>
              {t("auth.agreeToSellerAgreement")}
              <Link href="/seller-agreement">{t("auth.sellerAgreement")}</Link>
            </span>
          </label>
          {errors.agreeToSellerAgreement && (
            <p className="error-text">
              {errors.agreeToSellerAgreement.message}
            </p>
          )}

          <label className="checkbox-label">
            <input type="checkbox" {...registerField("agreeToTerms")} />
            <span>
              {t("auth.agreeToRules")}
              <Link href="/terms-conditions">{t("auth.rules")}</Link>
            </span>
          </label>
          {errors.agreeToTerms && (
            <p className="error-text">{errors.agreeToTerms.message}</p>
          )}
        </div>

        {!allAgreed && (
          <p className="error-text">{t("auth.agreementsRequired")}</p>
        )}

        <button
          type="submit"
          className="submit-btn"
          disabled={isPending || !allAgreed}
        >
          {isPending ? t("auth.registering") : t("auth.register")}
        </button>

        <div className="text-center">
          {t("auth.alreadyHaveAccount")}{" "}
          <Link href="/login" className="login-link">
            {t("auth.login")}
          </Link>
        </div>
      </form>
    </div>
  );
}
