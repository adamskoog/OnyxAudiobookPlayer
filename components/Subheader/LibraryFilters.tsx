import { useState, forwardRef, Dispatch, SetStateAction } from 'react';
import { Menu, UnstyledButton } from '@mantine/core';

import { useAppSelector, useAppDispatch } from '@/store'
import { setDisplayType, setSortOrder } from '@/store/features/librarySlice';
import { MUSIC_LIBRARY_DISPAY_TYPE, SORT_ORDER } from '@/plex';

import styles from './styles/LibraryFilters.module.css'

type FilterButtonProps = {
    title: string,
    isOpen: boolean,
    setIsOpen:Dispatch<SetStateAction<boolean>>
}

const FilterButton = forwardRef<HTMLButtonElement, FilterButtonProps>(({ title, isOpen, setIsOpen }: FilterButtonProps, ref) => {

    let classes = [styles.btn_menu];
    if (isOpen) classes.push(styles.btn_menu_open);

    return (
        <UnstyledButton ref={ref} className={classes.join(' ')} title={title} onClick={() => setIsOpen(!isOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8z"/><path d="M12 12.586 8.707 9.293l-1.414 1.414L12 15.414l4.707-4.707-1.414-1.414L12 12.586z"/>
            </svg>
        </UnstyledButton>
    )
})

FilterButton.displayName = 'FilterButton';

type FilterMenuProps = {
    caption: string,
    display: string,
    menus: MenuItem[]
}

function FilterMenu({ caption, display, menus }: FilterMenuProps) {

    const [isOpen, setIsOpen] = useState<boolean>(false)
    
    return (
        <div className={`${styles.filter_item}`}>
            <span className={`${styles.caption}`}>{`${caption}: ${display}`}</span>
            <Menu opened={isOpen} onChange={setIsOpen} width={100}>
                <Menu.Target>
                    <FilterButton title={`Select ${caption} type`} isOpen={isOpen} setIsOpen={setIsOpen} />
                </Menu.Target>
                <Menu.Dropdown>
                    <>
                        {menus.map(menu => (
                            <Menu.Item key={menu.title} onClick={menu.callback}>{menu.title}</Menu.Item>
                        ))}
                    </>
                </Menu.Dropdown>
            </Menu>
        </div>
    );
}

type MenuItem = {
    title: string,
    callback: () => void
}

function LibraryFilters() {

    const dispatch = useAppDispatch();

    const displayType = useAppSelector(state => state.library.displayType);
    const sortType = useAppSelector(state => state.library.sortType);
    
    const displayMenuItems = [
      { title: MUSIC_LIBRARY_DISPAY_TYPE.artist.title, callback: () => dispatch(setDisplayType(MUSIC_LIBRARY_DISPAY_TYPE.artist.title)) },
      { title: MUSIC_LIBRARY_DISPAY_TYPE.album.title, callback: () => dispatch(setDisplayType(MUSIC_LIBRARY_DISPAY_TYPE.album.title)) },
      { title: MUSIC_LIBRARY_DISPAY_TYPE.collection.title, callback: () => dispatch(setDisplayType(MUSIC_LIBRARY_DISPAY_TYPE.collection.title)) },
    ] as MenuItem[];
  
    const sortMenuItems = [
      { title: SORT_ORDER.ascending, callback: () => dispatch(setSortOrder(SORT_ORDER.ascending)) },
      { title: SORT_ORDER.descending, callback: () => dispatch(setSortOrder(SORT_ORDER.descending)) },
    ] as MenuItem[];;

    return (
        <div className={`${styles.container}`}>
            <FilterMenu caption={'Display'} display={displayType} menus={displayMenuItems} />
            <FilterMenu caption={'Order'} display={sortType} menus={sortMenuItems} />
        </div>
    );
}

export default LibraryFilters;