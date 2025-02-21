export interface BibleVerse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface RandomVerseResponse {
  random_verse: {
    book_id: string;
    book: string;
    chapter: number;
    verse: number;
    text: string;
  };
  translation: string;
}

export interface PassageResponse {
  reference: string;
  text: string;
  translation: string;
  verses: BibleVerse[];
}
