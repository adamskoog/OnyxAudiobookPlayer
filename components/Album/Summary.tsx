import { Spoiler  } from '@mantine/core';

import styles from './styles/Summary.module.css'

const formatSummary = (summary: string): string => {
    if (summary) {
      const splitted = summary.split('\n');
      return `<p>${splitted.join('</p><p>')}</p>`;
    }
    return '';
};


type SummaryProps = {
    summary: string
}

export default function Summary({ summary }: SummaryProps) {

  return (
    <div className={`${styles.container}`}>
        <Spoiler className={`${styles.spoiler}`} maxHeight={110} showLabel="Expand" hideLabel="Hide">
            <div className={`${styles.summary}`} dangerouslySetInnerHTML={{ __html: formatSummary(summary) }}></div>
        </Spoiler>
    </div>
  )
}
