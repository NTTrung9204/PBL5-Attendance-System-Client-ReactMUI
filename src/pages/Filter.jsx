import { Box } from '@mui/material';
import { useEffect, useRef, useState } from 'react';


function Filter(){

    const [state, setState] = useState(false)

    const modal = useRef()
    const modalContainer = useRef()

    const hideModal = ()=>{
        let strClass = modal.current.className.split(' ')
        if (!strClass.includes("hidden")){
            strClass.push('hidden')
            modal.current.className = strClass.join(' ')
        }
    }
    const openModal = ()=>{
        let strClass = modal.current.className.split(' ')
        if (strClass.includes("hidden")){
            const newClass = strClass.filter(item => item!='hidden')
            modal.current.className = newClass.join(' ')
        }
    }
    
    useEffect(()=>{
        if (modal) {
            console.log(modal)
            modal.current.addEventListener('click', hideModal)
        }
        if (modalContainer) modalContainer.current.addEventListener('click', function(e){
            e.stopPropagation();
        })
    }, [])

    useEffect(
        ()=>{
            
        }
    )

    return (
        <Box ref={modal} className={'modal'}>
            <Box ref={modalContainer} className={'modal_container'}>
                <Box className="filter_header">Filters</Box>
                <Box className="filter_body">
                    <label htmlFor="classes">Classes</label>
                    <input name="classes"></input>
                </Box>
                <Box className="filter_footer">
                    <button className='button'>Đóng</button>
                </Box>
            </Box>
        </Box>
    )
}

export default Filter