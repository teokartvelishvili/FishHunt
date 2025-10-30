interface LakeData {
  id: string;
  name: string;
  area: number; // km²
  maxDepth: number; // meters
  location: string;
  searchQuery: string;
  speciesCount: number;
  fish: {
    family: string;
    species: string[];
  }[];
}

export const GEORGIAN_LAKES: LakeData[] = [
  {
    id: 'paravani',
    name: 'პარავნის ტბა',
    area: 37.5,
    maxDepth: 3.3,
    location: 'ჯავახეთი, სამცხე-ჯავახეთი',
    searchQuery: 'პარავნის ტბა',
    speciesCount: 8,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'კობრი – Cyprinus carpio',
          'ჭაპალა/როჩი – Rutilus rutilus',
          'კაპოეტა – Capoeta capoeta'
        ]
      },
      {
        family: 'ორაგულისებრნი (Salmonidae)',
        species: [
          'ტროტი – Salmo trutta',
          'ვენდაისი/whitefish – Coregonus lavaretus'
        ]
      }
    ]
  },
  {
    id: 'tabatskuri',
    name: 'ტაბაწყურის ტბა',
    area: 14.2,
    maxDepth: 40.2,
    location: 'სამცხე-ჯავახეთი (ბორჯომი/ახალქალაქი)',
    searchQuery: 'ტაბაწყურის ტბა',
    speciesCount: 6,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'კობრი – Cyprinus carpio',
          'საბელი/ბერბელი – Barbus lacerta'
        ]
      },
      {
        family: 'ორაგულისებრნი (Salmonidae)',
        species: [
          'ბრაუნ ტროტი – Salmo trutta',
          'ვენდაისი/whitefish – Coregonus lavaretus'
        ]
      }
    ]
  },
  {
    id: 'madatapa',
    name: 'მადათაფას ტბა',
    area: 8.78,
    maxDepth: 1.7,
    location: 'ჯავახეთი, სამცხე-ჯავახეთი',
    searchQuery: 'მადათაფას ტბა',
    speciesCount: 5,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'გიბელ კარპი – Carassius gibelio',
          'კობრი – Cyprinus carpio'
        ]
      }
    ]
  },
  {
    id: 'kartsakhi',
    name: 'ყარწახის ტბა',
    area: 26.3,
    maxDepth: 1,
    location: 'ჯავახეთი, სამცხე-ჯავახეთი (საქართველო-თურქეთის საზღვარი)',
    searchQuery: 'ყარწახის ტბა',
    speciesCount: 3,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'კობრი – Cyprinus carpio',
          'ჭაპალა – Rutilus rutilus'
        ]
      }
    ]
  },
  {
    id: 'khanchali',
    name: 'ხანჭალის ტბა',
    area: 11.4,
    maxDepth: 1.4,
    location: 'ჯავახეთი (ნინოწმინდა)',
    searchQuery: 'ხანჭალის ტბა',
    speciesCount: 6,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'კობრი – Cyprinus carpio',
          'გიბელ კარპი – Carassius gibelio'
        ]
      },
      {
        family: 'ორაგულისებრნი (Salmonidae)',
        species: [
          'ტროტი – Salmo trutta',
          'ვენდაისი/whitefish – Coregonus lavaretus'
        ]
      }
    ]
  },
  {
    id: 'ritsa',
    name: 'რიწის ტბა',
    area: 1.49,
    maxDepth: 116,
    location: 'აფხაზეთი',
    searchQuery: 'რიწის ტბა',
    speciesCount: 3,
    fish: [
      {
        family: 'ორაგულისებრნი (Salmonidae)',
        species: [
          'ტროტი – Salmo trutta'
        ]
      }
    ]
  },
  {
    id: 'shaori',
    name: 'შაორის წყალსაცავი',
    area: 9.2,
    maxDepth: 14.5,
    location: 'რაჭა, რაჭა-ლეჩხუმი და ქვემო სვანეთი',
    searchQuery: 'შაორის წყალსაცავი',
    speciesCount: 4,
    fish: [
      {
        family: 'ორაგულისებრნი (Salmonidae)',
        species: ['ტროტი – Salmo trutta']
      },
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: ['კობრი – Cyprinus carpio']
      }
    ]
  },
  {
    id: 'bazaleti',
    name: 'ბაზალეთის ტბა',
    area: 1.22,
    maxDepth: 30,
    location: 'დუშეთის მუნიციპალიტეტი, მცხეთა-მთიანეთი',
    searchQuery: 'ბაზალეთის ტბა',
    speciesCount: 8,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'კობრი – Cyprinus carpio'
        ]
      },
      {
        family: 'წაღვისებრნი (Percidae)',
        species: ['pike-perch/პერჩი – Sander lucioperca']
      }
    ]
  },
  {
    id: 'jandari',
    name: 'ჯანდარის ტბა',
    area: 10.6,
    maxDepth: 7.2,
    location: 'გარდაბანი, ქვემო ქართლი',
    searchQuery: 'ჯანდარის ტბა',
    speciesCount: 6,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'კობრი – Cyprinus carpio',
          'ჭაპალა/როჩი – Rutilus rutilus',
          'საბელი/ბერბელი – Barbus lacerta'
        ]
      }
    ]
  },
  {
    id: 'tbilisi-sea',
    name: 'თბილისის ზღვა',
    area: 11.6,
    maxDepth: 45,
    location: 'თბილისი',
    searchQuery: 'თბილისის ზღვა',
    speciesCount: 5,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'კობრი – Cyprinus carpio',
          'ვერცხლისფერი კობრი – Hypophthalmichthys molitrix',
          'ბალახის კობრი – Ctenopharyngodon idella'
        ]
      }
    ]
  },
  {
    id: 'kumisi',
    name: 'კუმისის ტბა',
    area: 5.4,
    maxDepth: 4,
    location: 'თბილისი',
    searchQuery: 'კუმისის ტბა',
    speciesCount: 5,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'კობრი – Cyprinus carpio',
          'გიბელ კარპი – Carassius gibelio'
        ]
      }
    ]
  },
  {
    id: 'lisi',
    name: 'ლისის ტბა',
    area: 0.47,
    maxDepth: 4,
    location: 'თბილისი',
    searchQuery: 'ლისის ტბა',
    speciesCount: 4,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'კობრი – Cyprinus carpio',
          'გიბელ კარპი – Carassius gibelio'
        ]
      }
    ]
  },
  {
    id: 'tsalka',
    name: 'წალკის წყალსაცავი',
    area: 33.7,
    maxDepth: 25,
    location: 'წალკა, ქვემო ქართლი',
    searchQuery: 'წალკის წყალსაცავი',
    speciesCount: 6,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'კობრი – Cyprinus carpio',
          'ჭაპალა/როჩი – Rutilus rutilus'
        ]
      },
      {
        family: 'წაღვისებრნი (Percidae)',
        species: ['pike-perch/პერჩი – Sander lucioperca']
      }
    ]
  },
  {
    id: 'bughdasheni',
    name: 'ბუღდაშენის ტბა',
    area: 0.39,
    maxDepth: 0.85,
    location: 'ბოლნისი, ქვემო ქართლი',
    searchQuery: 'ბუღდაშენის ტბა',
    speciesCount: 4,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'კობრი – Cyprinus carpio',
          'გიბელ კარპი – Carassius gibelio'
        ]
      }
    ]
  },
  {
    id: 'cildir',
    name: 'ჭილდირის ტბა',
    area: 120,
    maxDepth: 42,
    location: 'თურქეთი (Kars) - საზღვართან ახლოს',
    searchQuery: 'ჭილდირის ტბა',
    speciesCount: 5,
    fish: [
      {
        family: 'ორაგულისებრნი (Salmonidae)',
        species: [
          'ტროტი – Salmo trutta'
        ]
      },
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'კობრი – Cyprinus carpio',
          'ჭაპალა – Rutilus rutilus'
        ]
      }
    ]
  },
  {
    id: 'saghamo',
    name: 'საღამოს ტბა',
    area: 4.8,
    maxDepth: 2.3,
    location: 'ნინოწმინდის მუნიციპალიტეტი, ჯავახეთი',
    searchQuery: 'საღამოს ტბა',
    speciesCount: 6,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'კობრი – Cyprinus carpio',
          'გიბელ კარპი – Carassius gibelio',
          'ჩაბი/კაპოეტა – Capoeta capoeta'
        ]
      },
      {
        family: 'ორაგულისებრნი (Salmonidae)',
        species: [
          'ტროტი – Salmo trutta',
          'ვენდაისი/whitefish – Coregonus lavaretus'
        ]
      }
    ]
  },
  {
    id: 'karagol',
    name: 'ყარაგოლი',
    area: 0.05,
    maxDepth: 5,
    location: 'ბორჯომი-ხარაგაული, სამცხე-ჯავახეთი',
    searchQuery: 'ყარაგოლის ტბა ბორჯომი',
    speciesCount: 2,
    fish: [
      {
        family: 'ორაგულისებრნი (Salmonidae)',
        species: ['ტროტი – Salmo trutta']
      }
    ]
  },
  {
    id: 'abudelauri',
    name: 'აბუდელაურის ტბები',
    area: 0.08,
    maxDepth: 2.5,
    location: 'ხევსურეთი, მცხეთა-მთიანეთი',
    searchQuery: 'აბუდელაურის ტბები',
    speciesCount: 1,
    fish: [
      {
        family: 'ორაგულისებრნი (Salmonidae)',
        species: ['ტროტი – Salmo trutta']
      }
    ]
  },
  {
    id: 'tobavarchkhili',
    name: 'ტობავარჩხილის ტბა',
    area: 0.25,
    maxDepth: 3,
    location: 'სამეგრელო, სამეგრელო-ზემო სვანეთი',
    searchQuery: 'ტობავარჩხილის ტბა',
    speciesCount: 2,
    fish: [
      {
        family: 'ორაგულისებრნი (Salmonidae)',
        species: ['ტროტი – Salmo trutta']
      }
    ]
  },
  {
    id: 'keli',
    name: 'ყელის ტბა',
    area: 1.28,
    maxDepth: 63,
    location: 'მცხეთა-მთიანეთი (აქალგორის რეგიონი)',
    searchQuery: 'ყელის ტბა',
    speciesCount: 2,
    fish: [
      {
        family: 'ორაგულისებრნი (Salmonidae)',
        species: ['ტროტი – Salmo trutta']
      }
    ]
  },
  {
    id: 'arkhoti',
    name: 'არხოტის ტბა',
    area: 0.06,
    maxDepth: 2,
    location: 'რაჭა, რაჭა-ლეჩხუმი და ქვემო სვანეთი',
    searchQuery: 'არხოტის ტბა რაჭა',
    speciesCount: 1,
    fish: [
      {
        family: 'ორაგულისებრნი (Salmonidae)',
        species: ['ტროტი – Salmo trutta']
      }
    ]
  },
  {
    id: 'koruldi',
    name: 'კორულდის ტბები',
    area: 0.04,
    maxDepth: 1.5,
    location: 'მესტია, სამეგრელო-ზემო სვანეთი',
    searchQuery: 'კორულდის ტბები მესტია',
    speciesCount: 1,
    fish: [
      {
        family: 'ორაგულისებრნი (Salmonidae)',
        species: ['ტროტი – Salmo trutta']
      }
    ]
  },
  {
    id: 'paliastomi',
    name: 'პალიასტომის ტბა',
    area: 18.2,
    maxDepth: 3,
    location: 'ქოლხეთის დაბლობი, სამეგრელო',
    searchQuery: 'პალიასტომის ტბა',
    speciesCount: 12,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'კობრი – Cyprinus carpio',
          'ჭაპალა – Rutilus rutilus'
        ]
      },
      {
        family: 'ღორჯოსებრნი (Gobiidae)',
        species: ['ღორჯო – Ponticola spp.']
      },
      {
        family: 'ლაგუნური სახეობები',
        species: ['შავი ზღვის ტიპის თევზები']
      }
    ]
  },
  {
    id: 'kalikitubani',
    name: 'კალიკის ტბა',
    area: 0.2,
    maxDepth: 1.5,
    location: 'თეთრიწყაროს მუნიციპალიტეტი, ქვემო ქართლი',
    searchQuery: 'კალიკის ტბა თეთრიწყარო',
    speciesCount: 2,
    fish: [
      {
        family: 'ორაგულისებრნი (Salmonidae)',
        species: ['ტროტი – Salmo trutta']
      }
    ]
  }
];
