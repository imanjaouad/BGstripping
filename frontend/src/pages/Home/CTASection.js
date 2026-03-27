import { Link } from "react-router-dom";
import "../../style/Home.css"

export default function CTASection() {
  return (
    <section className="py-5 cta-section text-white text-center">
      <div className="container">
        <p className="fs-5 mb-4">
          Accédez à vos outils, consultez vos rapports, et gérez vos opérations efficacement.
        </p>
      </div>
    </section>
  );
}