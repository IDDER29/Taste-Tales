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
          src="[Image URL 1]"
          alt="Image description 1"
          className="w-full h-auto"
        />
        <div>
          <h2 className="text-3xl font-semibold mb-4">History</h2>
          <p className="text-lg">
            [Blog Name] started in [Year] with a simple goal: to share our
            passion for [Topic] with the world. Over the years, we have grown
            from a small personal project to a thriving community of [number]
            readers who share our enthusiasm for [specific niche or subject].
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-3xl font-semibold mb-4">Mission</h2>
          <p className="text-lg">
            Our mission is to provide high-quality, engaging, and informative
            content about [Topic]. We believe in creating a space where readers
            can find inspiration, learn new things, and connect with like-minded
            individuals.
          </p>
        </div>
        <img
          src="[Image URL 2]"
          alt="Image description 2"
          className="w-full h-auto"
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <img
          src="[Image URL 3]"
          alt="Image description 3"
          className="w-full h-auto"
        />
        <div>
          <h2 className="text-3xl font-semibold mb-4">Our Goals</h2>
          <p className="text-lg">
            We aim to continuously provide valuable and engaging content, expand
            our community, and foster an inclusive environment for discussions
            and ideas.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-3xl font-semibold mb-4">Our Team</h2>
          <p className="text-lg">Meet the dedicated team behind [Blog Name].</p>
        </div>
        <img
          src="[Image URL 4]"
          alt="Image description 4"
          className="w-full h-auto"
        />
      </section>

      <section className="space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold">[Name]</h3>
            <p className="text-lg">Founder and Editor-in-Chief</p>
            <p className="text-lg">
              With a background in [relevant field], [Name] started [Blog Name]
              to combine [his/her/their] love for [Topic] and storytelling.
            </p>
          </div>
          <img
            src="[Image URL 5]"
            alt="Image description 5"
            className="w-full h-auto"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold">[Name]</h3>
            <p className="text-lg">Senior Writer</p>
            <p className="text-lg">
              [Name] brings a wealth of knowledge in [specific subject] and a
              unique voice that resonates with our audience.
            </p>
          </div>
          <img
            src="[Image URL 6]"
            alt="Image description 6"
            className="w-full h-auto"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold">[Name]</h3>
            <p className="text-lg">Content Strategist</p>
            <p className="text-lg">
              [Name] ensures our content is always fresh, relevant, and aligned
              with our readers' interests.
            </p>
          </div>
          <img
            src="[Image URL 7]"
            alt="Image description 7"
            className="w-full h-auto"
          />
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
