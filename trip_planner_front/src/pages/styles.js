const styles = {
    page: {
        minHeight: "100vh",
        boxSizing: "border-box",
        backgroundColor: "#fbf7f2",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px"
    },

    badge: {
        padding: "8px 14px",
        borderRadius: "999px",
        backgroundColor: "#ffffff",
        border: "1px solid #e9dfd6",
        fontSize: "12px",
        color: "#777",
        boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
        cursor: "default"
    },

    fox: {
        marginTop: "32px",
        maxWidth: "960px",
        width: "100%",
        textAlign: "center",
        cursor: "default"
    },

    title: {
        fontSize: "45px",
        fontWeight: "900",
        letterSpacing: "-0.03em",
        margin: 0,
        marginBottom: "20px",
        color: "#111",
        cursor: "default"
    },

    foxText: {
        color: "#FF8A00",
        fontSize: "62px",
        marginLeft: "10px"
    },

    mascotWrap: {
        margin: "20px auto"
    },

    mascot: {
        width: "120px",
        height: "120px",
        objectFit: "contain",
        filter: "drop-shadow(0 10px 16px rgba(0,0,0,0.1))"
    },

    subtitle: {
        fontSize: "18px",
        lineHeight: 1.6,
        color: "#333",
        marginBottom: "20px"
    },

    accentText: {
        color: "#f47a20",
        fontWeight: "800"
    },
    foxAccent: {
        color: "#FF8A00",
        fontWeight: "800",
    },

    button: {
        backgroundColor: "#f47a20",
        color: "#fff",
        border: "none",
        borderRadius: "999px",
        padding: "12px 20px",
        fontSize: "14px",
        fontWeight: "700",
        cursor: "pointer",
        boxShadow: "0 10px 22px rgba(244,122,32,0.3)",
        transition: "all 0.2s ease",   
    },

    buttonHover: {
        transform: "translateY(-2px)", 
        backgroundColor: "#ff761bff",
    },

    cards: {
        marginTop: "36px",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px"
    },

    card: {
        backgroundColor: "#ffffff",
        borderRadius: "22px",
        border: "1px solid #e9dfd6",
        minHeight: "150px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "540",
        fontSize: "16px",
        boxShadow: "0 14px 30px rgba(0,0,0,0.05)",
        padding: "20px",
        transition: "all 0.25s ease",   
        cursor: "default",
    },

    cardHover: {
        transform: "translateY(-6px)",  
        boxShadow: "0 22px 44px rgba(0,0,0,0.12)",
    },
    cardText: {
        textAlign: "center",
    }
}

export default styles
