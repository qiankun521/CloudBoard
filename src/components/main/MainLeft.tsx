import styles from '../../assets/styles/Main/MainLeft.module.scss';
import { AiOutlineSearch, AiOutlineHome, AiOutlineFieldTime, AiOutlineBook } from "react-icons/ai";
import { Input, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SelectInfo } from 'rc-menu/lib/interface';
import { MouseEvent } from 'react';
import { observer } from 'mobx-react';
import logo from '../../assets/photos/logo.png';
const items = [
    {
        label: '首页',
        key: '/',
        icon: <AiOutlineHome style={{ fontSize: '1rem' }}></AiOutlineHome>
    },
    {
        label: '最近打开',
        key: '/recently',
        icon: <AiOutlineFieldTime style={{ fontSize: '1rem' }}></AiOutlineFieldTime>
    },
    {
        label: '我的收藏',
        key: '/collection',
        icon: <AiOutlineBook style={{ fontSize: '1rem' }}></AiOutlineBook>
    },
    {
        label: '模板中心',
        key: '/example',
        icon: <AiOutlineBook style={{ fontSize: '1rem' }}></AiOutlineBook>
    }
]
const MainLeft = observer(() => {
    const navigate = useNavigate();
    const handleSelect = (info: SelectInfo) => {
        navigate('/home' + info.key);
    }
    const handleClick = (e: MouseEvent) => {
        e.preventDefault();//搜索modal
    }
    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                <img src={logo} alt="website logo"/>
            </div>
            <Input
                size='middle'
                placeholder='搜索'
                className={styles.search}
                prefix={<AiOutlineSearch style={{ fontSize: '1rem' }}></AiOutlineSearch>}
                onClick={handleClick}
            ></Input>
            <Menu
                style={{ width: '95%', marginTop: '1rem', fontSize: '0.95rem' }}
                defaultSelectedKeys={
                    [window.location.pathname === '/' ? '/' : window.location.pathname.slice(5)]
                }
                onSelect={handleSelect}
                items={items}
            ></Menu>
        </div>
    )
})
export default MainLeft;