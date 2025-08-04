// This is where I'm keeping my interfaces. These match with my schemas in the backend and are here to keep me consistent.

export interface FileObject {
  type: 'image' | 'pdf';
  url: string;
  public_id: string;
  uploadedAt: string;
}

export interface AboutObject {
    headshot: FileObject;
    blurb: string;
    resume: FileObject;
}

export interface ExperienceObject {
  typeEx: "Professional" | "Education" | "Personal";
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  highlights: string[];
  skills: string[];
  images: FileObject[];
  extra: string;
}

export interface ProjectObject {
  name: string;
  startDate: string;
  endDate: string;
  images: FileObject[];
  gitLink: string;
  replitLink: string;
  highlights: string[];
  skills: string[];
  extra: string;
}
