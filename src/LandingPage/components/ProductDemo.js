import "../utils/globals.css";
import demoImage from "./wmremove-transformed.png";

export default function ProductDemo() {
  console.log(demoImage);
  return (
    <section className="product-demo">
      <div className="demo-content">
        {/* <div className="demo-features">
          <div className="feature">
            <span>Seamless connection to any interview meeting software</span>
          </div>
          <div className="feature">
            <span>Real-time transcription from interviewer</span>
          </div>
          <div className="feature">
            <span>Real-time and personalized suggestions for answers</span>
          </div>
        </div> */}
        <div className="demo-image">
          <img
            src={demoImage}
            alt="Interview interface demo"
          />
        </div>
      </div>
    </section>
  );
}
