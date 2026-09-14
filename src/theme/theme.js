import { createTheme } from "@mui/material/styles";

const theme = createTheme({

    palette:{

        primary:{
            main:"rgb(15,0,95)"
        },

        secondary:{
            main:"#1976d2"
        },

        background:{
            default:"#F5F7FA",
            paper:"#FFFFFF"
        },

        text:{
            primary:"#1F2937",
            secondary:"#6B7280"
        }

    },

    typography:{

        fontFamily:[
            "Calibri",
            "Times New Roman",
            "sans-serif"
        ].join(","),

        h4:{
            fontWeight:700
        },

        h5:{
            fontWeight:600
        },

        button:{
            textTransform:"none",
            fontWeight:600
        }

    },

    shape:{
        borderRadius:12
    }

});

export default theme;
