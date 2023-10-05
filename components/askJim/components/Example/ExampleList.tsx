import { Example } from "./Example";

import styles from "./Example.module.css";

export type ExampleModel = {
    text: string;
    value: string;
};

const EXAMPLES: ExampleModel[] = [
    {
        text: "What is covered in the vitality world wide travel cover?",
        value: "What is covered in the vitality world wide travel cover?"
    },
    { text: "What happens in a performance review?", value: "What happens in a performance review?" },
    { text: "What are the core duties of Engineering Discipline Lead?", value: "What are the core duties of Engineering Discipline Lead?" }
];

interface Props {
    onExampleClicked: (value: string) => void;
}

export const ExampleList = ({ onExampleClicked }: Props) => {
    return (
        <ul className={styles.examplesNavList}>
            {EXAMPLES.map((x, i) => (
                <li key={i}>
                    <Example text={x.text} value={x.value} onClick={onExampleClicked} />
                </li>
            ))}
        </ul>
    );
};
