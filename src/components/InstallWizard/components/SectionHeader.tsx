import styles from "./sectionHeader.module.css";

interface SectionHeaderProps {
  title: string;
  description: string;
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <p className={styles.helperText}>{description}</p>
    </>
  );
}
