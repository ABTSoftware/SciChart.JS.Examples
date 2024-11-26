import { FC } from "react";
import styles from "./Loader.module.scss";

export const Loader: FC = () => (
    <div className={styles.container}>
        <div className={styles.spinner} />
    </div>
);
