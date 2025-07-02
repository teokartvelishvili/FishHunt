interface RiverData {
  id: string;
  name: string;
  totalLength: number;
  lengthInGeorgia: number;
  basin: string;
  searchQuery: string;
  speciesCount: number;
  buttonColor?: string;
  buttonText?: string;
  fish: {
    family: string;
    species: string[];
  }[];
}

export const GEORGIAN_RIVERS: RiverData[] = [
  {
    id: 'mtkvari',
    name: 'მტკვარი',
    totalLength: 1364,
    lengthInGeorgia: 351,
    basin: 'კასპიის ზღვა',
    searchQuery: 'მტკვრის სანაპირო',
    speciesCount: 26,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'კასპიური რჩევა – Rutilus rutilus caspicus',
          'ბარბუსი – Barbus cyri',
          'მურსა – Barbus mursa',
          'ჩუბი – Squalius cephalus',
          'ღორჯო – Gobio lepidolaemus',
          'ალაზნის ღორჯო – Ponticola alazanicus',
          'კაპოეტა – Capoeta capoeta',
          'კაპოეტა გრეკი – Capoeta gracilis',
          'კაპოეტა ტინკა – Capoeta tinca',
          'ჩონდროსტომა (ნაზე) – Chondrostoma cyri',
          'ვიმბა – Vimba vimba',
          'რბილი კობრი – Carassius carassius',
          'გოლდენ ფიში (ინვაზიური) – Carassius gibelio',
          'კობრი – Cyprinus carpio',
          'პსევდორაზბორა (ინვაზიური) – Pseudorasbora parva',
          'ლეუცისკუსი – Leuciscus leuciscus'
        ]
      },
      {
        family: 'ლოჩისებრნი (Cobitidae)',
        species: ['ოქროს ლოჩი – Sabanejewia aurata']
      },
      {
        family: 'ლამპრედასებრნი (Petromyzontidae)',
        species: ['მდინარის ლამპრედა – Eudontomyzon mariae']
      },
      {
        family: 'სალმონისებრნი (Salmonidae)',
        species: [
          'კასპიური ტრაუტი – Salmo caspius',
          'ყვითელი ტრაუტი – Salmo trutta fario',
          'შავი ზღვის ტრაუტი – Salmo labrax'
        ]
      },
      {
        family: 'კატისებრნი (Siluridae)',
        species: ['ევროპული კატლფიში – Silurus glanis']
      },
      {
        family: 'პაიკისებრნი (Esocidae)',
        species: ['პაიკი – Esox lucius']
      },
      {
        family: 'ბლიცებისებრნი (Blicca/Ballerus)',
        species: [
          'ბლიცა – Blicca bjoerkna',
          'ბალერუს საპა – Ballerus sapa'
        ]
      },
      {
        family: 'ოქსინოემაკეილუსისებრნი',
        species: ['ბრანდტის ღორჯო – Oxynoemacheilus brandtii']
      }
    ]
  },
  {
    id: 'rioni',
    name: 'რიონი',
    totalLength: 327,
    lengthInGeorgia: 327,
    basin: 'შავი ზღვა',
    searchQuery: 'რიონის სანაპირო',
    speciesCount: 27,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'რჩევა – Rutilus frisii kutum',
          'ბარბუსი – Barbus tauricus',
          'მურსა – Barbus lacerta',
          'ჩუბი – Squalius orientalis',
          'ღორჯო – Gobio caucasicus',
          'კაპოეტა – Capoeta sieboldii',
          'კაპოეტა გრეკი – Capoeta gracilis',
          'ნაზე – Chondrostoma nasus',
          'ვიმბა – Vimba vimba',
          'კობრი – Cyprinus carpio',
          'ბლიცა – Blicca bjoerkna',
          'რბილი კობრი – Carassius carassius',
          'ვერცხლის კობრი – Carassius gibelio (ინვაზიური)',
          'ლეუცისკუსი – Leuciscus leuciscus'
        ]
      },
      {
        family: 'ლოჩისებრნი (Cobitidae)',
        species: [
          'ოქროს ლოჩი – Sabanejewia aurata',
          'ხვეულღორჯო – Cobitis taenia'
        ]
      },
      {
        family: 'სალმონისებრნი (Salmonidae)',
        species: [
          'შავი ზღვის კალმახი – Salmo labrax',
          'რიონის კალმახი – Salmo rionica (ენდემური)',
          'ყვითელი კალმახი – Salmo trutta fario',
          'ატლანტიკური ლოქო – Hucho hucho (ძალიან იშვიათი)'
        ]
      },
      {
        family: 'ლამპრედასებრნი (Petromyzontidae)',
        species: [
          'შავი ზღვის ლამპრედა – Petromyzon marinus',
          'მდინარის ლამპრედა – Eudontomyzon mariae'
        ]
      },
      {
        family: 'კატისებრნი (Siluridae)',
        species: ['ევროპული კატლფიში – Silurus glanis']
      },
      {
        family: 'პაიკისებრნი (Esocidae)',
        species: ['პაიკი – Esox lucius']
      },
      {
        family: 'ქარისტესებრნი (Gasterosteidae)',
        species: ['სამეკობრე ქარისტე – Gasterosteus aculeatus']
      },
      {
        family: 'ღორჯოსებრნი (Nemacheilidae)',
        species: [
          'ბრანდტის ღორჯო – Oxynoemacheilus brandtii',
          'ღრმა ღორჯო – Oxynoemacheilus angorae'
        ]
      }
    ]
  },
  {
    id: 'tergi',
    name: 'თერგი',
    totalLength: 623,
    lengthInGeorgia: 30,
    basin: 'კასპიის ზღვა',
    searchQuery: 'თერგის სანაპირო',
    speciesCount: 15,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'ჩუბი – Squalius cephalus',
          'ბარბუსი – Barbus cyri',
          'რჩევა – Rutilus rutilus',
          'ნაზე – Chondrostoma nasus',
          'ვიმბა – Vimba vimba',
          'რბილი კობრი – Carassius carassius',
          'ვერცხლის კობრი – Carassius gibelio (ინვაზიური)',
          'კობრი – Cyprinus carpio'
        ]
      },
      {
        family: 'ლოჩისებრნი (Cobitidae)',
        species: [
          'ოქროს ლოჩი – Sabanejewia aurata',
          'ხვეულღორჯო – Cobitis taenia'
        ]
      },
      {
        family: 'ღორჯოსებრნი (Nemacheilidae)',
        species: [
          'ბრანდტის ღორჯო – Oxynoemacheilus brandtii',
          'ღრმა ღორჯო – Oxynoemacheilus angorae'
        ]
      },
      {
        family: 'სალმონისებრნი (Salmonidae)',
        species: [
          'თერგის კალმახი – Salmo ciscaucasicus (ენდემური)',
          'კალმახი – Salmo trutta fario'
        ]
      },
      {
        family: 'ლამპრედასებრნი (Petromyzontidae)',
        species: ['მდინარის ლამპრედა – Eudontomyzon mariae']
      }
    ]
  },
  {
    id: 'choroxi',
    name: 'ჭოროხი',
    totalLength: 438,
    lengthInGeorgia: 26,
    basin: 'შავი ზღვა',
    searchQuery: 'ჭოროხის სანაპირო',
    speciesCount: 23,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'რჩევა – Rutilus frisii kutum',
          'ჩუბი – Squalius orientalis',
          'ბარბუსი - Barbus tauricus',
          'მურსა – Barbus lacerta',
          'ღორჯო – Gobio caucasicus',
          'კაპოეტა – Capoeta capoeta',
          'კაპოეტა გრეკი – Capoeta gracilis',
          'ნაზე – Chondrostoma nasus',
          'ვიმბა – Vimba vimba',
          'კობრი – Cyprinus carpio',
          'რბილი კობრი – Carassius carassius',
          'ვერცხლის კობრი – Carassius gibelio (ინვაზიური)',
          'ბლიცა – Blicca bjoerkna',
          'ლეუცისკუსი – Leuciscus leuciscus'
        ]
      },
      {
        family: 'ლოჩისებრნი (Cobitidae)',
        species: [
          'ოქროს ლოჩი – Sabanejewia aurata',
          'ხვეულღორჯო – Cobitis taenia'
        ]
      },
      {
        family: 'ღორჯოსებრნი (Nemacheilidae)',
        species: [
          'ბრანდტის ღორჯო – Oxynoemacheilus brandtii',
          'ღრმა ღორჯო – Oxynoemacheilus angorae'
        ]
      },
      {
        family: 'სალმონისებრნი (Salmonidae)',
        species: [
          'შავი ზღვის კალმახი – Salmo labrax',
          'ტრაუტი – Salmo trutta fario'
        ]
      },
      {
        family: 'კატისებრნი (Siluridae)',
        species: ['კატლფიში – Silurus glanis']
      },
      {
        family: 'პაიკისებრნი (Esocidae)',
        species: ['პაიკი – Esox lucius']
      },
      {
        family: 'ქარისტესებრნი (Gasterosteidae)',
        species: ['სამეკობრე ქარისტე – Gasterosteus aculeatus']
      }
    ]
  },
  {
    id: 'enguri',
    name: 'ენგური',
    totalLength: 213,
    lengthInGeorgia: 213,
    basin: 'შავი ზღვა',
    searchQuery: 'ენგურის სანაპირო',
    speciesCount: 16,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'რჩევა – Rutilus frisii',
          'ბარბუსი – Barbus tauricus',
          'ჩუბი – Squalius orientalis',
          'ღორჯო – Gobio caucasicus',
          'კაპოეტა – Capoeta capoeta',
          'ნაზე – Chondrostoma nasus',
          'ვიმბა – Vimba vimba',
          'კობრი – Cyprinus carpio',
          'რბილი კობრი – Carassius carassius',
          'ვერცხლის კობრი – Carassius gibelio',
          'ბლიცა – Blicca bjoerkna'
        ]
      },
      {
        family: 'ლოჩისებრნი (Cobitidae)',
        species: ['ოქროს ლოჩი – Sabanejewia aurata']
      },
      {
        family: 'ღორჯოსებრნი (Nemacheilidae)',
        species: ['ბრანდტის ღორჯო – Oxynoemacheilus brandtii']
      },
      {
        family: 'სალმონისებრნი (Salmonidae)',
        species: [
          'შავი ზღვის კალმახი – Salmo labrax',
          'ტრაუტი – Salmo trutta fario'
        ]
      },
      {
        family: 'ქარისტესებრნი (Gasterosteidae)',
        species: ['სამეკობრე ქარისტე – Gasterosteus aculeatus']
      }
    ]
  },
  {
    id: 'kodori',
    name: 'კოდორი',
    totalLength: 117,
    lengthInGeorgia: 117,
    basin: 'შავი ზღვა',
    searchQuery: 'კოდორის სანაპირო',
    speciesCount: 14,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'რჩევა – Rutilus frisii',
          'ბარბუსი – Barbus tauricus',
          'ჩუბი – Squalius orientalis',
          'ღორჯო – Gobio caucasicus',
          'ნაზე – Chondrostoma nasus',
          'ვიმბა – Vimba vimba',
          'კობრი – Cyprinus carpio',
          'რბილი კობრი – Carassius carassius',
          'ვერცხლის კობრი – Carassius gibelio (ინვაზიური)'
        ]
      },
      {
        family: 'ლოჩისებრნი (Cobitidae)',
        species: ['ოქროს ლოჩი – Sabanejewia aurata']
      },
      {
        family: 'ღორჯოსებრნი (Nemacheilidae)',
        species: ['ბრანდტის ღორჯო – Oxynoemacheilus brandtii']
      },
      {
        family: 'სალმონისებრნი (Salmonidae)',
        species: [
          'შავი ზღვის კალმახი – Salmo labrax',
          'ტრაუტი – Salmo trutta fario'
        ]
      },
      {
        family: 'ქარისტესებრნი (Gasterosteidae)',
        species: ['სამეკობრე ქარისტე – Gasterosteus aculeatus']
      }
    ]
  },
  {
    id: 'alazani',
    name: 'ალაზანი',
    totalLength: 351,
    lengthInGeorgia: 390,
    basin: 'მტკვარი',
    searchQuery: 'ალაზნის სანაპირო',
    speciesCount: 17,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'ჩუბი – Squalius cephalus',
          'ბარბუსი – Barbus cyri',
          'რჩევა – Rutilus rutilus',
          'მურსა – Barbus lacerta',
          'ნაზე – Chondrostoma nasus',
          'ვიმბა – Vimba vimba',
          'კობრი – Cyprinus carpio',
          'ვერცხლის კობრი – Carassius gibelio (ინვაზიური)',
          'რბილი კობრი – Carassius carassius',
          'ბლიცა – Blicca bjoerkna',
          'ლეუცისკუსი – Leuciscus leuciscus'
        ]
      },
      {
        family: 'ლოჩისებრნი (Cobitidae)',
        species: ['ოქროს ლოჩი – Sabanejewia aurata']
      },
      {
        family: 'ღორჯოსებრნი (Nemacheilidae)',
        species: [
          'ბრანდტის ღორჯო – Oxynoemacheilus brandtii',
          'ღრმა ღორჯო – Oxynoemacheilus angorae'
        ]
      },
      {
        family: 'სალმონისებრნი (Salmonidae)',
        species: [
          'ალაზნის კალმახი – Salmo ciscaucasicus',
          'ტრაუტი – Salmo trutta fario'
        ]
      },
      {
        family: 'ლამპრედასებრნი (Petromyzontidae)',
        species: ['მდინარის ლამპრედა – Eudontomyzon mariae']
      }
    ]
  },
  {
    id: 'bzipi',
    name: 'ბზიფი',
    totalLength: 110,
    lengthInGeorgia: 110,
    basin: 'შავი ზღვა',
    searchQuery: 'ბზიფის სანაპირო',
    speciesCount: 15,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'რჩევა – Rutilus frisii',
          'ჩუბი – Squalius orientalis',
          'ბარბუსი – Barbus tauricus',
          'ღორჯო – Gobio caucasicus',
          'კაპოეტა – Capoeta capoeta',
          'ნაზე – Chondrostoma nasus',
          'ვიმბა – Vimba vimba',
          'კობრი – Cyprinus carpio',
          'რბილი კობრი – Carassius carassius',
          'ვერცხლის კობრი – Carassius gibelio (ინვაზიური)'
        ]
      },
      {
        family: 'ლოჩისებრნი (Cobitidae)',
        species: ['ოქროს ლოჩი – Sabanejewia aurata']
      },
      {
        family: 'ღორჯოსებრნი (Nemacheilidae)',
        species: ['ბრანდტის ღორჯო – Oxynoemacheilus brandtii']
      },
      {
        family: 'სალმონისებრნი (Salmonidae)',
        species: [
          'შავი ზღვის კალმახი – Salmo labrax',
          'ტრაუტი – Salmo trutta fario'
        ]
      },
      {
        family: 'ქარისტესებრნი (Gasterosteidae)',
        species: ['სამეკობრე ქარისტე – Gasterosteus aculeatus']
      }
    ]
  },
  {
    id: 'kvirila',
    name: 'ყვირილა',
    totalLength: 140,
    lengthInGeorgia: 140,
    basin: 'რიონი',
    searchQuery: 'ყვირილას სანაპირო',
    speciesCount: 12,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'ჩუბი – Squalius cephalus',
          'ბარბუსი – Barbus cyri',
          'რჩევა – Rutilus rutilus',
          'ნაზე – Chondrostoma nasus',
          'ვიმბა – Vimba vimba',
          'კობრი – Cyprinus carpio',
          'ვერცხლის კობრი – Carassius gibelio (ინვაზიური)',
          'რბილი კობრი – Carassius carassius'
        ]
      },
      {
        family: 'ლოჩისებრნი (Cobitidae)',
        species: ['ოქროს ლოჩი – Sabanejewia aurata']
      },
      {
        family: 'ღორჯოსებრნი (Nemacheilidae)',
        species: [
          'ბრანდტის ღორჯო – Oxynoemacheilus brandtii',
          'ღრმა ღორჯო – Oxynoemacheilus angorae'
        ]
      },
      {
        family: 'სალმონისებრნი (Salmonidae)',
        species: ['კალმახი – Salmo trutta fario']
      }
    ]
  },
  {
    id: 'tskhenistskali',
    name: 'ცხენისწყალი',
    totalLength: 176,
    lengthInGeorgia: 176,
    basin: 'რიონი',
    searchQuery: 'ცხენისწყლის სანაპირო',
    speciesCount: 11,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'ჩუბი – Squalius cephalus',
          'ბარბუსი – Barbus cyri',
          'რჩევა – Rutilus rutilus',
          'ნაზე – Chondrostoma nasus',
          'ვიმბა – Vimba vimba',
          'კობრი – Cyprinus carpio',
          'რბილი კობრი – Carassius carassius',
          'ვერცხლის კობრი – Carassius gibelio (ინვაზიური)'
        ]
      },
      {
        family: 'ლოჩისებრნი (Cobitidae)',
        species: ['ოქროს ლოჩი – Sabanejewia aurata']
      },
      {
        family: 'ღორჯოსებრნი (Nemacheilidae)',
        species: ['ბრანდტის ღორჯო – Oxynoemacheilus brandtii']
      },
      {
        family: 'სალმონისებრნი (Salmonidae)',
        species: ['კალმახი – Salmo trutta fario']
      }
    ]
  },
  {
    id: 'xrami',
    name: 'ხრამი',
    totalLength: 201,
    lengthInGeorgia: 187,
    basin: 'მტკვარი',
    searchQuery: 'ხრამის სანაპირო',
    speciesCount: 13,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'ჩუბი – Squalius cephalus',
          'ბარბუსი – Barbus cyri',
          'რჩევა – Rutilus rutilus',
          'ნაზე – Chondrostoma nasus',
          'ვიმბა – Vimba vimba',
          'კობრი – Cyprinus carpio',
          'რბილი კობრი – Carassius carassius',
          'ვერცხლის კობრი – Carassius gibelio (ინვაზიური)',
          'ბლიცა – Blicca bjoerkna'
        ]
      },
      {
        family: 'ლოჩისებრნი (Cobitidae)',
        species: ['ოქროს ლოჩი – Sabanejewia aurata']
      },
      {
        family: 'ღორჯოსებრნი (Nemacheilidae)',
        species: [
          'ბრანდტის ღორჯო – Oxynoemacheilus brandtii',
          'ღრმა ღორჯო – Oxynoemacheilus angorae'
        ]
      },
      {
        family: 'სალმონისებრნი (Salmonidae)',
        species: ['კალმახი – Salmo trutta fario']
      }
    ]
  },
  {
    id: 'aragvi',
    name: 'არაგვი',
    totalLength: 112,
    lengthInGeorgia: 112,
    basin: 'მტკვარი',
    searchQuery: 'არაგვის სანაპირო',
    speciesCount: 11,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'ჩუბი – Squalius cephalus',
          'ბარბუსი – Barbus cyri',
          'რჩევა – Rutilus rutilus',
          'ნაზე – Chondrostoma nasus',
          'ვიმბა – Vimba vimba',
          'კობრი – Cyprinus carpio',
          'რბილი კობრი – Carassius carassius',
          'ვერცხლის კობრი – Carassius gibelio (ინვაზიური)'
        ]
      },
      {
        family: 'ლოჩისებრნი (Cobitidae)',
        species: ['ოქროს ლოჩი – Sabanejewia aurata']
      },
      {
        family: 'ღორჯოსებრნი (Nemacheilidae)',
        species: ['ბრანდტის ღორჯო – Oxynoemacheilus brandtii']
      },
      {
        family: 'სალმონისებრნი (Salmonidae)',
        species: ['კალმახი – Salmo trutta fario']
      }
    ]
  },
  {
    id: 'acharistskali',
    name: 'აჭარისწყალი',
    totalLength: 90,
    lengthInGeorgia: 90,
    basin: 'ჭოროხი',
    searchQuery: 'აჭარისწყლის სანაპირო',
    speciesCount: 11,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'ჩუბი – Squalius orientalis',
          'ბარბუსი – Barbus tauricus',
          'რჩევა – Rutilus frisii',
          'ნაზე – Chondrostoma nasus',
          'ვიმბა – Vimba vimba',
          'კობრი – Cyprinus carpio',
          'რბილი კობრი – Carassius carassius',
          'ვერცხლის კობრი – Carassius gibelio (ინვაზიური)'
        ]
      },
      {
        family: 'ლოჩისებრნი (Cobitidae)',
        species: ['ოქროს ლოჩი – Sabanejewia aurata']
      },
      {
        family: 'ღორჯოსებრნი (Nemacheilidae)',
        species: ['ბრანდტის ღორჯო – Oxynoemacheilus brandtii']
      },
      {
        family: 'სალმონისებრნი (Salmonidae)',
        species: ['შავი ზღვის კალმახი – Salmo labrax']
      }
    ]
  },
  {
    id: 'xobi',
    name: 'ხობისწყალი',
    totalLength: 150,
    lengthInGeorgia: 150,
    basin: 'შავი ზღვა',
    searchQuery: 'ხობისწყლის სანაპირო',
    speciesCount: 12,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'რჩევა – Rutilus frisii',
          'ჩუბი – Squalius orientalis',
          'ბარბუსი – Barbus tauricus',
          'ღორჯო – Gobio caucasicus',
          'ვიმბა – Vimba vimba',
          'კობრი – Cyprinus carpio',
          'რბილი კობრი – Carassius carassius',
          'ვერცხლის კობრი – Carassius gibelio (ინვაზიური)'
        ]
      },
      {
        family: 'ლოჩისებრნი (Cobitidae)',
        species: ['ოქროს ლოჩი – Sabanejewia aurata']
      },
      {
        family: 'ღორჯოსებრნი (Nemacheilidae)',
        species: ['ბრანდტის ღორჯო – Oxynoemacheilus brandtii']
      },
      {
        family: 'სალმონისებრნი (Salmonidae)',
        species: [
          'შავი ზღვის კალმახი – Salmo labrax',
          'ტრაუტი – Salmo trutta fario'
        ]
      }
    ]
  },
  {
    id: 'liaxvi',
    name: 'ლიახვი',
    totalLength: 115,
    lengthInGeorgia: 115,
    basin: 'მტკვარი',
    searchQuery: 'ლიახვის სანაპირო',
    speciesCount: 11,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'ჩუბი – Squalius cephalus',
          'ბარბუსი – Barbus cyri',
          'რჩევა – Rutilus rutilus',
          'ნაზე – Chondrostoma nasus',
          'ვიმბა – Vimba vimba',
          'კობრი – Cyprinus carpio',
          'რბილი კობრი – Carassius carassius',
          'ვერცხლის კობრი – Carassius gibelio (ინვაზიური)'
        ]
      },
      {
        family: 'ლოჩისებრნი (Cobitidae)',
        species: ['ოქროს ლოჩი – Sabanejewia aurata']
      },
      {
        family: 'ღორჯოსებრნი (Nemacheilidae)',
        species: ['ბრანდტის ღორჯო – Oxynoemacheilus brandtii']
      },
      {
        family: 'სალმონისებრნი (Salmonidae)',
        species: ['კალმახი – Salmo trutta fario']
      }
    ]
  },
  {
    id: 'supsa',
    name: 'სუფსა',
    totalLength: 108,
    lengthInGeorgia: 108,
    basin: 'შავი ზღვა',
    searchQuery: 'სუფსის სანაპირო',
    speciesCount: 12,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'რჩევა – Rutilus frisii',
          'ჩუბი – Squalius orientalis',
          'ბარბუსი – Barbus tauricus',
          'ღორჯო – Gobio caucasicus',
          'ვიმბა – Vimba vimba',
          'კობრი – Cyprinus carpio',
          'რბილი კობრი – Carassius carassius',
          'ვერცხლის კობრი – Carassius gibelio (ინვაზიური)'
        ]
      },
      {
        family: 'ლოჩისებრნი (Cobitidae)',
        species: ['ოქროს ლოჩი – Sabanejewia aurata']
      },
      {
        family: 'ღორჯოსებრნი (Nemacheilidae)',
        species: ['ბრანდტის ღორჯო – Oxynoemacheilus brandtii']
      },
      {
        family: 'სალმონისებრნი (Salmonidae)',
        species: [
          'შავი ზღვის კალმახი – Salmo labrax',
          'ტრაუტი – Salmo trutta fario'
        ]
      }
    ]
  },
  {
    id: 'texuri',
    name: 'ტეხური',
    totalLength: 101,
    lengthInGeorgia: 101,
    basin: 'რიონი',
    searchQuery: 'ტეხურის სანაპირო',
    speciesCount: 12,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'რჩევა – Rutilus frisii',
          'ჩუბი – Squalius orientalis',
          'ბარბუსი – Barbus tauricus',
          'ღორჯო – Gobio caucasicus',
          'ვიმბა – Vimba vimba',
          'კობრი – Cyprinus carpio',
          'რბილი კობრი – Carassius carassius',
          'ვერცხლის კობრი – Carassius gibelio (ინვაზიური)'
        ]
      },
      {
        family: 'ლოჩისებრნი (Cobitidae)',
        species: ['ოქროს ლოჩი – Sabanejewia aurata']
      },
      {
        family: 'ღორჯოსებრნი (Nemacheilidae)',
        species: ['ბრანდტის ღორჯო – Oxynoemacheilus brandtii']
      },
      {
        family: 'სალმონისებრნი (Salmonidae)',
        species: [
          'შავი ზღვის კალმახი – Salmo labrax',
          'ტრაუტი – Salmo trutta fario'
        ]
      }
    ]
  },
  {
    id: 'natanebi',
    name: 'ნატანები',
    totalLength: 60,
    lengthInGeorgia: 60,
    basin: 'შავი ზღვა',
    searchQuery: 'ნატანების სანაპირო',
    speciesCount: 12,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'რჩევა – Rutilus frisii',
          'ჩუბი – Squalius orientalis',
          'ბარბუსი – Barbus tauricus',
          'ღორჯო – Gobio caucasicus',
          'ვიმბა – Vimba vimba',
          'კობრი – Cyprinus carpio',
          'რბილი კობრი – Carassius carassius',
          'ვერცხლის კობრი – Carassius gibelio (ინვაზიური)'
        ]
      },
      {
        family: 'ლოჩისებრნი (Cobitidae)',
        species: ['ოქროს ლოჩი – Sabanejewia aurata']
      },
      {
        family: 'ღორჯოსებრნი (Nemacheilidae)',
        species: ['ბრანდტის ღორჯო – Oxynoemacheilus brandtii']
      },
      {
        family: 'სალმონისებრნი (Salmonidae)',
        species: [
          'შავი ზღვის კალმახი – Salmo labrax',
          'ტრაუტი – Salmo trutta fario'
        ]
      }
    ]
  },
  {
    id: 'galidzga',
    name: 'ღალიძგა',
    totalLength: 53,
    lengthInGeorgia: 53,
    basin: 'შავი ზღვა',
    searchQuery: 'ღალიძგის სანაპირო',
    speciesCount: 12,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'რჩევა – Rutilus frisii',
          'ჩუბი – Squalius orientalis',
          'ბარბუსი – Barbus tauricus',
          'ღორჯო – Gobio caucasicus',
          'ვიმბა – Vimba vimba',
          'კობრი – Cyprinus carpio',
          'რბილი კობრი – Carassius carassius',
          'ვერცხლის კობრი – Carassius gibelio (ინვაზიური)'
        ]
      },
      {
        family: 'ლოჩისებრნი (Cobitidae)',
        species: ['ოქროს ლოჩი – Sabanejewia aurata']
      },
      {
        family: 'ღორჯოსებრნი (Nemacheilidae)',
        species: ['ბრანდტის ღორჯო – Oxynoemacheilus brandtii']
      },
      {
        family: 'სალმონისებრნი (Salmonidae)',
        species: [
          'შავი ზღვის კალმახი – Salmo labrax',
          'ტრაუტი – Salmo trutta fario'
        ]
      }
    ]
  },
  {
    id: 'xanistskali',
    name: 'ხანისწყალი',
    totalLength: 57,
    lengthInGeorgia: 57,
    basin: 'რიონი',
    searchQuery: 'ხანისწყლის სანაპირო',
    speciesCount: 12,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'რჩევა – Rutilus frisii',
          'ჩუბი – Squalius orientalis',
          'ბარბუსი – Barbus tauricus',
          'ღორჯო – Gobio caucasicus',
          'ვიმბა – Vimba vimba',
          'კობრი – Cyprinus carpio',
          'რბილი კობრი – Carassius carassius',
          'ვერცხლის კობრი – Carassius gibelio (ინვაზიური)'
        ]
      },
      {
        family: 'ლოჩისებრნი (Cobitidae)',
        species: ['ოქროს ლოჩი – Sabanejewia aurata']
      },
      {
        family: 'ღორჯოსებრნი (Nemacheilidae)',
        species: ['ბრანდტის ღორჯო – Oxynoemacheilus brandtii']
      },
      {
        family: 'სალმონისებრნი (Salmonidae)',
        species: [
          'შავი ზღვის კალმახი – Salmo labrax',
          'ტრაუტი – Salmo trutta fario'
        ]
      }
    ]
  },
  {
    id: 'potsxovi',
    name: 'ფოცხოვისწყალი',
    totalLength: 64,
    lengthInGeorgia: 64,
    basin: 'მტკვარი',
    searchQuery: 'ფოცხოვისწყლის სანაპირო',
    speciesCount: 11,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'ჩუბი – Squalius cephalus',
          'ბარბუსი – Barbus cyri',
          'რჩევა – Rutilus rutilus',
          'ნაზე – Chondrostoma nasus',
          'ვიმბა – Vimba vimba',
          'კობრი – Cyprinus carpio',
          'რბილი კობრი – Carassius carassius',
          'ვერცხლის კობრი – Carassius gibelio (ინვაზიური)'
        ]
      },
      {
        family: 'ლოჩისებრნი (Cobitidae)',
        species: ['ოქროს ლოჩი – Sabanejewia aurata']
      },
      {
        family: 'ღორჯოსებრნი (Nemacheilidae)',
        species: ['ბრანდტის ღორჯო – Oxynoemacheilus brandtii']
      },
      {
        family: 'სალმონისებრნი (Salmonidae)',
        species: [
          'შავი ზღვის კალმახი – Salmo labrax',
          'ტრაუტი – Salmo trutta fario'
        ]
      }
    ]
  },
  {
    id: 'tushetis-alazani',
    name: 'თუშეთის ალაზანი',
    totalLength: 59,
    lengthInGeorgia: 59,
    basin: 'მტკვარი',
    searchQuery: 'თუშეთის ალაზნის სანაპირო',
    speciesCount: 11,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'ჩუბი – Squalius cephalus',
          'რჩევა – Rutilus rutilus',
          'ბარბუსი – Barbus cyri',
          'ვიმბა – Vimba vimba',
          'ნაზე – Chondrostoma nasus',
          'კობრი – Cyprinus carpio',
          'რბილი კობრი – Carassius carassius',
          'ვერცხლის კობრი – Carassius gibelio (ინვაზიური)'
        ]
      },
      {
        family: 'ღორჯოსებრნი (Nemacheilidae)',
        species: ['ბრანდტის ღორჯო – Oxynoemacheilus brandtii']
      },
      {
        family: 'ლოჩისებრნი (Cobitidae)',
        species: ['ოქროს ლოჩი – Sabanejewia aurata']
      },
      {
        family: 'სალმონისებრნი (Salmonidae)',
        species: ['კალმახი – Salmo trutta fario']
      }
    ]
  },
  {
    id: 'paravani',
    name: 'ფარავანი',
    totalLength: 74,
    lengthInGeorgia: 74,
    basin: 'მტკვარი',
    searchQuery: 'ფარავნის სანაპირო',
    speciesCount: 6,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'ფარავნის თევზი – Chondrostoma oxyrhynchum',
          'ბარბუსი – Barbus goktschaicus',
          'რჩევა – Rutilus rutilus',
          'კობრი – Cyprinus carpio',
          'ვერცხლის კობრი – Carassius gibelio (ინვაზიური)'
        ]
      },
      {
        family: 'ღორჯოსებრნი (Nemacheilidae)',
        species: ['ბრანდტის ღორჯო – Oxynoemacheilus brandtii']
      }
    ]
  },
  {
    id: 'iori',
    name: 'იორი',
    totalLength: 320,
    lengthInGeorgia: 183,
    basin: 'მტკვარი',
    searchQuery: 'იორის სანაპირო',
    speciesCount: 10,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'ჩუბი – Squalius cephalus',
          'ბარბუსი – Barbus cyri',
          'რჩევა – Rutilus rutilus',
          'ვიმბა – Vimba vimba',
          'ნაზე – Chondrostoma nasus',
          'კობრი – Cyprinus carpio',
          'რბილი კობრი – Carassius carassius',
          'ვერცხლის კობრი – Carassius gibelio (ინვაზიური)'
        ]
      },
      {
        family: 'ლოჩისებრნი (Cobitidae)',
        species: ['ოქროს ლოჩი – Sabanejewia aurata']
      },
      {
        family: 'ღორჯოსებრნი (Nemacheilidae)',
        species: ['ბრანდტის ღორჯო – Oxynoemacheilus brandtii']
      }
    ]
  },
  {
    id: 'ksani',
    name: 'ქსანი',
    totalLength: 84,
    lengthInGeorgia: 84,
    basin: 'მტკვარი',
    searchQuery: 'ქსნის სანაპირო',
    speciesCount: 8,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'ჩუბი – Squalius cephalus',
          'ბარბუსი – Barbus cyri',
          'რჩევა – Rutilus rutilus',
          'ვიმბა – Vimba vimba',
          'კობრი – Cyprinus carpio',
          'რბილი კობრი – Carassius carassius',
          'ვერცხლის კობრი – Carassius gibelio (ინვაზიური)'
        ]
      },
      {
        family: 'ღორჯოსებრნი (Nemacheilidae)',
        species: ['ბრანდტის ღორჯო – Oxynoemacheilus brandtii']
      }
    ]
  },
  {
    id: 'kintrishi',
    name: 'კინტრიში',
    totalLength: 45,
    lengthInGeorgia: 45,
    basin: 'შავი ზღვა',
    searchQuery: 'კინტრიშის სანაპირო',
    speciesCount: 12,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'რჩევა – Rutilus frisii',
          'ჩუბი – Squalius orientalis',
          'ბარბუსი – Barbus tauricus',
          'ღორჯო – Gobio caucasicus',
          'ვიმბა – Vimba vimba',
          'კობრი – Cyprinus carpio',
          'რბილი კობრი – Carassius carassius',
          'ვერცხლის კობრი – Carassius gibelio (ინვაზიური)'
        ]
      },
      {
        family: 'ლოჩისებრნი (Cobitidae)',
        species: ['ოქროს ლოჩი – Sabanejewia aurata']
      },
      {
        family: 'ღორჯოსებრნი (Nemacheilidae)',
        species: ['ბრანდტის ღორჯო – Oxynoemacheilus brandtii']
      },
      {
        family: 'სალმონისებრნი (Salmonidae)',
        species: [
          'შავი ზღვის კალმახი – Salmo labrax',
          'ტრაუტი – Salmo trutta fario'
        ]
      }
    ]
  },
  {
    id: 'jejora',
    name: 'ჯეჯორა',
    totalLength: 45,
    lengthInGeorgia: 45,
    basin: 'შავი ზღვა',
    searchQuery: 'ჯეჯორის სანაპირო',
    speciesCount: 12,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'რჩევა – Rutilus frisii',
          'ჩუბი – Squalius orientalis',
          'ბარბუსი – Barbus tauricus',
          'ღორჯო – Gobio caucasicus',
          'ვიმბა – Vimba vimba',
          'კობრი – Cyprinus carpio',
          'რბილი კობრი – Carassius carassius',
          'ვერცხლის კობრი – Carassius gibelio (ინვაზიური)'
        ]
      },
      {
        family: 'ლოჩისებრნი (Cobitidae)',
        species: ['ოქროს ლოჩი – Sabanejewia aurata']
      },
      {
        family: 'ღორჯოსებრნი (Nemacheilidae)',
        species: ['ბრანდტის ღორჯო – Oxynoemacheilus brandtii']
      },
      {
        family: 'სალმონისებრნი (Salmonidae)',
        species: [
          'შავი ზღვის კალმახი – Salmo labrax',
          'ტრაუტი – Salmo trutta fario'
        ]
      }
    ]
  },
  {
    id: 'piriqiti-alazani',
    name: 'პირიქითი ალაზანი',
    totalLength: 49,
    lengthInGeorgia: 49,
    basin: 'მტკვარი',
    searchQuery: 'პირიქითი ალაზნის სანაპირო',
    speciesCount: 10,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'ჩუბი – Squalius cephalus',
          'ბარბუსი – Barbus cyri',
          'რჩევა – Rutilus rutilus',
          'ნაზე – Chondrostoma nasus',
          'ვიმბა – Vimba vimba',
          'კობრი – Cyprinus carpio',
          'რბილი კობრი – Carassius carassius',
          'ვერცხლის კობრი – Carassius gibelio (ინვაზიური)'
        ]
      },
      {
        family: 'ლოჩისებრნი (Cobitidae)',
        species: ['ოქროს ლოჩი – Sabanejewia aurata']
      },
      {
        family: 'ღორჯოსებრნი (Nemacheilidae)',
        species: ['ბრანდტის ღორჯო – Oxynoemacheilus brandtii']
      }
    ]
  },
  {
    id: 'algeti',
    name: 'ალგეთი',
    totalLength: 116,
    lengthInGeorgia: 116,
    basin: 'მტკვარი',
    searchQuery: 'ალგეთის სანაპირო',
    speciesCount: 10,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'ჩუბი – Squalius cephalus',
          'ბარბუსი – Barbus cyri',
          'რჩევა – Rutilus rutilus',
          'ნაზე – Chondrostoma nasus',
          'ვიმბა – Vimba vimba',
          'კობრი – Cyprinus carpio',
          'რბილი კობრი – Carassius carassius',
          'ვერცხლის კობრი – Carassius gibelio (ინვაზიური)'
        ]
      },
      {
        family: 'ლოჩისებრნი (Cobitidae)',
        species: ['ოქროს ლოჩი – Sabanejewia aurata']
      },
      {
        family: 'ღორჯოსებრნი (Nemacheilidae)',
        species: ['ბრანდტის ღორჯო – Oxynoemacheilus brandtii']
      }
    ]
  },
  {
    id: 'pichori',
    name: 'ფიჩორი',
    totalLength: 57,
    lengthInGeorgia: 57,
    basin: 'პალიასტომი',
    searchQuery: 'ფიჩორის სანაპირო',
    speciesCount: 12,
    fish: [
      {
        family: 'კობრისებრნი (Cyprinidae)',
        species: [
          'რჩევა – Rutilus frisii',
          'ჩუბი – Squalius orientalis',
          'ბარბუსი – Barbus tauricus',
          'ღორჯო – Gobio caucasicus',
          'ვიმბა – Vimba vimba',
          'კობრი – Cyprinus carpio',
          'რბილი კობრი – Carassius carassius',
          'ვერცხლის კობრი – Carassius gibelio (ინვაზიური)'
        ]
      },
      {
        family: 'ლოჩისებრნი (Cobitidae)',
        species: ['ოქროს ლოჩი – Sabanejewia aurata']
      },
      {
        family: 'ღორჯოსებრნი (Nemacheilidae)',
        species: ['ბრანდტის ღორჯო – Oxynoemacheilus brandtii']
      },
      {
        family: 'სალმონისებრნი (Salmonidae)',
        species: [
          'შავი ზღვის კალმახი – Salmo labrax',
          'ტრაუტი – Salmo trutta fario'
        ]
      }
    ]
  }
];
