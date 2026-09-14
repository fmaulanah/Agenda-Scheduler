import {
    Card,
    CardContent,
    Divider,
    Typography,
    Box
} from "@mui/material";

function AppCard({

    title,

    action,

    children,

    sx = {}

}) {

    return (

        <Card
            elevation={2}
            sx={{

                borderRadius:3,

                overflow:"hidden",

                ...sx

            }}
        >

            {title && (

                <>

                    <Box
                        sx={{

                            display:"flex",

                            justifyContent:"space-between",

                            alignItems:"center",

                            px:3,

                            py:2

                        }}
                    >

                        <Typography
                            variant="h6"
                            fontWeight={600}
                        >

                            {title}

                        </Typography>

                        {action}

                    </Box>

                    <Divider />

                </>

            )}

            <CardContent
                sx={{
                    p:3
                }}
            >

                {children}

            </CardContent>

        </Card>

    );

}

export default AppCard;