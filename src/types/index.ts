export interface LoginData {
  email: string;
  senha: string;
}

export interface LoginErrors {
  email?: string;
  senha?: string;
}

export interface StudentFormData {
  nome: string;
  rm: string;
  telefone: string;
  email: string;
  endereco: string;
  turma: string;
  semestre: string;
  photo?: string;  // ADICIONADO
}

export interface TeacherFormData {
  nome: string;
  rp: string;
  telefone: string;
  email: string;
  disciplina: string;
  unidade: string;
  tipoAvaliacao: string;
  photo?: string;  // ADICIONADO
}

export interface FormErrors {
  photo?: string;  // ADICIONADO
  nome?: string;
  rm?: string;
  rp?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  turma?: string;
  semestre?: string;
  disciplina?: string;
  unidade?: string;
  tipoAvaliacao?: string;
}