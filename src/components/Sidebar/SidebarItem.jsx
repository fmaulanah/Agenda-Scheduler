import { ListItemButton, ListItemIcon, ListItemText, Tooltip } from "@mui/material";

function SidebarItem({ title, icon: Icon, selected, onClick, isCollapsed = false })
{

    const content = (

        <>

            <ListItemIcon

                sx={{

                    minWidth:40,

                    color:"inherit"

                }}

            >

                <Icon/>

            </ListItemIcon>

            {!isCollapsed && (

                <ListItemText

                    primary={title}

                />

            )}

        </>

    );

    if (isCollapsed) {

        return (

            <Tooltip title={title} placement="right">

                <ListItemButton

                    selected={selected}

                    onClick={onClick}

                    sx={{

                        mx:1,

                        my:.5,

                        borderRadius:2,

                        "&.Mui-selected":{

                            bgcolor:"primary.main",

                            color:"white",

                            "& .MuiListItemIcon-root":{

                                color:"white"

                            }

                        },

                        "&:hover":{

                            bgcolor:"primary.light",

                            color:"white",

                            "& .MuiListItemIcon-root":{

                                color:"white"

                            }

                        }

                    }}

                >

                    {content}

                </ListItemButton>

            </Tooltip>

        );

    }

    return(

        <ListItemButton

            selected={selected}

            onClick={onClick}

            sx={{

                mx:1,

                my:.5,

                borderRadius:2,

                "&.Mui-selected":{

                    bgcolor:"primary.main",

                    color:"white",

                    "& .MuiListItemIcon-root":{

                        color:"white"

                    }

                },

                "&:hover":{

                    bgcolor:"primary.light",

                    color:"white",

                    "& .MuiListItemIcon-root":{

                        color:"white"

                    }

                }

            }}

        >

            {content}

        </ListItemButton>

    );

}

export default SidebarItem;