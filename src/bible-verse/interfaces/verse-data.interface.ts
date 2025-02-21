export interface BibleVerse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface VerseData {
  reference: string;
  text: string;
  translation: string;
  verses: BibleVerse[];
}

// Define source info type
export interface SourceInfo {
  passage: string;
  useRandomEndpoint: boolean;
  bookIds?: string[];
}
