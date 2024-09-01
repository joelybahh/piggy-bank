import React from 'react';

export default async function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold text-purple-600">Piggy Bank</div>
          <div className="space-x-4">
            <a href="#why-piggy-bank" className="text-gray-600 hover:text-purple-600">Why Piggy Bank?</a>
            <a href="#features" className="text-gray-600 hover:text-purple-600">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-purple-600">How It Works</a>
            <a href="#pricing" className="text-gray-600 hover:text-purple-600">Pricing</a>

            <a href="/login" className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-purple-700 transition duration-300">Sign In</a>
            <a href="/register" className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-purple-700 transition duration-300">Sign Up</a>
            </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-purple-700 mb-4">
            Teach Your Kids Financial Wisdom, Not Just Spending
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Piggy Bank: The safe, fun way for Aussie kids of all ages to learn real money skills without real money risks.
          </p>
          <button className="bg-purple-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-purple-700 transition duration-300">
            Start Your 45-Day Free Trial
          </button>
        </section>

        {/* Why Piggy Bank Section */}
        <section id="why-piggy-bank" className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-purple-700 mb-12">Why Choose Piggy Bank?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Safe Learning Environment</h3>
                <p className="text-gray-600">Kids learn financial concepts without the risks of real money transactions. Perfect for building confidence and skills.</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">For All Ages, Even Under 6</h3>
                <p className="text-gray-600">Unlike other apps restricted by banking laws, Piggy Bank is suitable for children of all ages. Start financial education early!</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Parental Peace of Mind</h3>
                <p className="text-gray-600">No real money means no unexpected charges or overspending. You're always in control of your family's finances.</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Teaches Real-World Skills</h3>
                <p className="text-gray-600">From budgeting to goal-setting, Piggy Bank instills valuable financial habits that last a lifetime.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-purple-700 mb-12">Features Designed for Learning</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon="🎯"
                title="Smart Goal Setting"
                description="Help kids set and achieve savings goals, teaching patience and planning."
              />
              <FeatureCard
                icon="📊"
                title="Visual Progress Tracking"
                description="Engaging charts and graphics make saving fun and easy to understand."
              />
              <FeatureCard
                icon="🏆"
                title="Reward System"
                description="Customize rewards for completed tasks and achieved goals, reinforcing positive habits."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-purple-700 mb-12">How Piggy Bank Works</h2>
            <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
              <StepCard number={1} text="Set up your family account and add your children" />
              <StepCard number={2} text="Customize savings goals and rewards" />
              <StepCard number={3} text="Track progress and celebrate achievements" />
              <StepCard number={4} text="Watch financial skills grow in a safe environment" />
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="bg-purple-100 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-purple-700 mb-12">What Families Are Saying</h2>
            <div className="flex justify-center">
              <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl">
                <p className="text-gray-600 italic mb-4">
                  "Piggy Bank has transformed how we talk about money in our family. Our 5-year-old is learning concepts I didn't understand until adulthood!"
                </p>
                <p className="font-semibold text-purple-600">- Emma, mother of two</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-purple-700 mb-12">Simple, Affordable Yearly Pricing</h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
              <PricingCard
                title="Basic Family"
                price="$35"
                period="per year"
                features={[
                  "For families with 1-2 children",
                  "Virtual piggy bank for each child",
                  "Basic goal setting and tracking",
                  "Parental controls and oversight"
                ]}
                cta="Start 45-Day Free Trial"
              />
              <PricingCard
                title="Growing Family"
                price="$45"
                period="per year"
                features={[
                  "For families with 3+ children",
                  "All Basic Family features",
                  "Advanced goal setting and analytics",
                  "Customizable reward system",
                  "Financial education modules"
                ]}
                cta="Best Value - Try Free for 45 Days"
                highlighted={true}
              />
            </div>
            <p className="text-center mt-8 text-gray-600">Both plans come with a 45-day free trial. No credit card required to start.</p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-purple-700 mb-4">Ready to Empower Your Kids' Financial Future?</h2>
            <p className="text-xl text-gray-600 mb-8">Join thousands of Aussie families teaching real money skills in a safe, fun environment.</p>
            <button className="bg-purple-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-purple-700 transition duration-300">
              Start Your 45-Day Free Trial Now
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-purple-700 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Piggy Bank. Empowering Aussie kids with financial wisdom.</p>
        </div>
      </footer>
    </div>
  );
};

type FeatureCardProps = {
    icon: string;
    title: string;
    description: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-purple-50 p-6 rounded-lg text-center">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

type StepCardProps = {
    number: number;
    text: string;
};

const StepCard: React.FC<StepCardProps> = ({ number, text }) => (
  <div className="bg-purple-50 p-6 rounded-lg text-center w-64">
    <div className="text-3xl font-bold text-purple-600 mb-2">{number}</div>
    <p className="text-gray-600">{text}</p>
  </div>
);

type PricingCardProps = {
    title: string;
    price: string;
    period: string;
    features: string[];
    cta: string;
    highlighted?: boolean;
};

const PricingCard: React.FC<PricingCardProps> = ({ title, price, period, features, cta, highlighted = false }) => (
  <div className={`bg-white p-8 rounded-lg shadow-lg w-full md:w-96 ${highlighted ? 'ring-2 ring-purple-500' : ''}`}>
    <h3 className="text-2xl font-bold text-purple-700 mb-4">{title}</h3>
    <p className="text-4xl font-bold mb-1">{price}</p>
    <p className="text-xl text-gray-500 mb-6">{period}</p>
    <ul className="mb-8">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center mb-2">
          <span className="text-green-500 mr-2">✓</span>
          <span className="text-gray-600">{feature}</span>
        </li>
      ))}
    </ul>
    <button className={`w-full py-3 px-4 rounded-full font-semibold ${
      highlighted 
        ? 'bg-purple-600 text-white hover:bg-purple-700' 
        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
    } transition duration-300`}>
      {cta}
    </button>
  </div>
);