export interface LanguageOption {
  id: number;
  name: string;
  label: string;
  value: string;
}

export interface OutputDetails {
  status: {
    id: number;
  };
  compile_output?: string;
  stdout?: string;
  stderr?: string;
}
