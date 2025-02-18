import { Box } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { memo } from "react";
import MenuButton from "./MenuButton";


function Card() {

    const CardDropDown = memo(() => {

        return (
            <>

            </>
        )
    })

    const menuItemsList = [
        {
            title: "Join",
            onClick: () => console.log("join")
        },
        {
            title: "Back",
            onClick: () => console.log("Back")
        },
    ]


    return (
        <>

            <Box sx={{
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                width: "300px",
                height: "auto",
                backgroundColor: "#ccc"
            }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "10px",
                        width: "100%"
                    }}
                >
                    <Avatar sx={{}}>N</Avatar>
                    <span style={{ width: "100%" }}>Hello Hello Hello Hello Hello Hello Hello Hello Hello</span>
                    <MenuButton
                        menuItem={menuItemsList}
                    />
                </Box>
                <Box> </Box>
            </Box>
        </>
    )
}

export default Card;