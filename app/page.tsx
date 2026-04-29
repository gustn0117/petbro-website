import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import News from "@/components/News";
import Process from "@/components/Process";
import Products from "@/components/Products";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function HomePage() {
  return (
    <main className="relative">
      <Header />
      <Hero />
      <About />
      <Process />
      <Products />
      <News />
      <Contact />
      <Footer />
      <RevealOnScroll />
    </main>
  );
}
