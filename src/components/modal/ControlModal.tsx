import styles from '../../assets/styles/Modal/ControlModal.module.scss';
import { Input, Button } from 'antd';
import { useState, useEffect, useRef, useContext } from 'react';
import { observer } from 'mobx-react';
import { storeContext } from '../../stores/storeContext';
import { useNavigate } from 'react-router-dom';
const ControlModal = observer(() => {
    const store = useContext(storeContext);
    return (
        <section className={styles.container}>
            
        </section>
    )
});
export default ControlModal;