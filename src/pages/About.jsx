import React from "react";

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto p-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold">ABOUT</h1>
        <p className="text-xl mt-4">Our Blog</p>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <img
          src="https://images.newrepublic.com/d517f59cdd0e2808c9a93f21844ae6487013e2f1.jpeg?w=1400"
          alt="Image description 1"
          className="w-full h-auto"
        />
        <div>
          <h2 className="text-3xl font-semibold mb-4">History</h2>
          <p className="text-lg">
            Founded in 2020, "Marrakesh Nights" emerged from a shared passion
            for Moroccan culture and cuisine among three friends: the Founder,
            Editor-in-Chief, and Senior Writer. Recognizing a gap in Agadir's
            dining scene for an authentic yet innovative Moroccan restaurant,
            they embarked on a journey to bring the flavors and hospitality of
            Morocco to locals and tourists alike. Their initial challenges,
            including sourcing authentic ingredients and training staff in
            traditional cooking methods, were overcome with determination and a
            commitment to quality.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-3xl font-semibold mb-4">Mission</h2>
          <p className="text-lg">
            The mission of "Marrakesh Nights" is to celebrate Moroccan culinary
            traditions while introducing contemporary twists that appeal to a
            global palate. We strive to create an immersive dining experience
            that not only satisfies the appetite but also educates and delights
            the senses, showcasing the richness of Moroccan culture through our
            food, decor, and live entertainment.
          </p>
        </div>
        <img
          src="https://www.eatthis.com/wp-content/uploads/sites/4/2023/07/RestaurantMeal.jpg?quality=82&strip=1"
          alt="Image description 2"
          className="w-full h-auto"
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <img
          src="https://townsquare.media/site/721/files/2019/04/GettyImages-1008225984.jpg?w=1200&amp;h=0&amp;zc=1&amp;s=0&amp;a=t&amp;q=89"
          alt="Image description 3"
          className="w-full h-auto"
        />
        <div>
          <h2 className="text-3xl font-semibold mb-4">Our Goals</h2>
          <p className="text-lg">
            Looking ahead, "Marrakesh Nights" aims to expand its footprint in
            Agadir and beyond, becoming a recognized brand synonymous with
            Moroccan hospitality and culinary excellence. We plan to introduce
            seasonal menus that highlight the versatility of Moroccan cuisine
            and host cultural events that engage our community. Additionally, we
            aspire to collaborate with local artisans and farmers to promote
            sustainable practices and support the local economy.
          </p>
        </div>
      </section>

      <section className=" lg:grid-cols-2 gap-8 mb-12 flex flex-col">
        <div className="text-center">
          <h1 className="text-3xl font-semibold mb-4">Our Team</h1>
          <p className="text-lg">
            Meet the dedicated team behind Marrakesh Nights.
          </p>
        </div>
        <img
          src="https://www.gastronomieguide.de/fileadmin/news/2017/10/13-stunden-taeglich-gastronomie.jpg"
          alt="Image description 4"
          className="w-full h-auto"
        />
      </section>

      <section className="space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold">Hamza Hossani</h3>
            <p className="text-lg">Founder and Editor-in-Chief</p>
            <p className="text-lg">
              With a background in hospitality and a deep love for Moroccan
              cuisine, the Founder oversees the strategic direction of
              "Marrakesh Nights," ensuring that every aspect of the restaurant
              reflects the warmth and generosity inherent in Moroccan culture.
            </p>
          </div>
          <img
            src="https://d2gr5kl7dt2z3t.cloudfront.net/blog/wp-content/uploads/2017/02/22153109/shutterstock_399217630.jpg"
            alt="Image description 5"
            className="w-full h-auto"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold">Idder AIT EL MOUDEN</h3>
            <p className="text-lg">Full Stack Web developer</p>
            <p className="text-lg">
              Joining the core team as a tech-savvy innovator, the Developer is
              responsible for creating and maintaining the digital
              infrastructure of "Marrakesh Nights." This includes developing the
              restaurant's website, implementing online reservation systems,
              managing social media platforms, and integrating customer
              relationship management tools to enhance guest experiences. With a
              keen eye for user experience and a strong understanding of
              emerging technologies, the Developer ensures that "Marrakesh
              Nights" remains at the forefront of digital innovation within the
              hospitality industry. Their role is pivotal in bridging the gap
              between traditional Moroccan hospitality and modern dining
              expectations, offering guests seamless interactions both online
              and offline.
            </p>
          </div>
          <img
            src="https://cdn.fishki.net/upload/post/2018/09/13/2702682/depositphotos-138413092-l-2015.jpg
            "
            alt="Image description 6"
            className="w-full h-auto"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold">Jeslyn Chanchaleune</h3>
            <p className="text-lg">Content Strategist</p>
            <p className="text-lg">
              As the creative force behind our digital and print content, the
              Senior Writer collaborates closely with the Editor-in-Chief to
              develop engaging narratives that resonate with our audience. They
              also strategize content plans, ensuring our messaging aligns with
              our brand identity and business goals.
            </p>
          </div>
          <img
            src="https://mydmi.imgix.net/v3blog/What-Skills-Do-I-need-to-be-a-Content-Strategist.jpg?crop=edges&fit=crop&fm=jpg&h=1260&ixlib=php-3.3.1&q=40&w=2400&s=8445f3d9fb1e1ee8ebb086a18e1c0e54"
            alt="Image description 7"
            className="w-full h-auto"
          />
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
