import { Loader as MantineLoader } from '@mantine/core';

import styles from './styles/Loader.module.css'

type LoaderProps = {
    loading: boolean
}

function Loader({ loading }: LoaderProps) {

    if (!loading) return <></>

    return (
        <div className={`${styles.loader}`}>
            <MantineLoader color="orange" variant="dots" />
        </div>   
    )
}

export default Loader;