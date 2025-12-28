// Type declarations for CSS modules and other imports
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.sass" {
  const content: { [className: string]: string };
  export default content;
}

// Image imports
declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.jpeg" {
  const value: string;
  export default value;
}

declare module "*.gif" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}

declare module "*.webp" {
  const value: string;
  export default value;
}

declare module "*.ico" {
  const value: string;
  export default value;
}

// Audio files
declare module "*.wav" {
  const value: string;
  export default value;
}

declare module "*.mp3" {
  const value: string;
  export default value;
}

// Other file types
declare module "*.json" {
  const value: Record<string, unknown>;
  export default value;
}

// Google Maps API
declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}
