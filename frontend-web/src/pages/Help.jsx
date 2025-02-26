import Taxi from "../assets/help_logo.svg";

function Help() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "450px",
      textAlign: "center"
    }}>
     
      <img src={Taxi} alt="Taxi Logo" style={{ width: "197px", height: "197px", marginBottom: "20px" }} />

      
      <h2 style={{
        fontSize: "48px",
        fontFamily: "Inter",
        fontWeight: "400",
        wordWrap: "break-word",
        background: "linear-gradient(90deg, #FFD12E, #FF7C1D)",
        WebkitBackgroundClip: "text",  
        WebkitTextFillColor: "transparent" 
      }}>
        Welcome to Urban Drive Support
      </h2>
    </div>
  );
}

export default Help;