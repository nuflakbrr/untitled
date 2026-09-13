export interface AboutValue {
  label: string;
  title: string;
  description: string;
  className: string;
}

export interface AboutHeaderProps {
  title: string;
  subtitle: string;
}

export interface AboutValuesProps {
  items: AboutValue[];
}
