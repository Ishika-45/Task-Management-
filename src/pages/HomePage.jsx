import React from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Layout,
  Calendar,
  BarChart,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import CompanyCarousel from "../components/company-carousel";
import { loadRazorpay } from "../utils/razorpay";

const faqs = [
  {
    question: "What is PlanPilot?",
    answer:
      "PlanPilot is a powerful project management tool designed to help teams organize, track, and manage their work efficiently. It combines intuitive design with robust features to streamline your workflow and boost productivity.",
  },
  {
    question: "How does PlanPilot compare to other project management tools?",
    answer:
      "PlanPilot offers a unique combination of intuitive design, powerful features, and flexibility. Unlike other tools, we focus on providing a seamless experience for both agile and traditional project management methodologies, making it versatile for various team structures and project types.",
  },
  {
    question: "Is PlanPilot suitable for small teams?",
    answer:
      "Absolutely! PlanPilot is designed to be scalable and flexible. It works great for small teams and can easily grow with your organization as it expands. Our user-friendly interface ensures that teams of any size can quickly adapt and start benefiting from PlanPilot's features.",
  },
  {
    question: "What key features does PlanPilot offer?",
    answer:
      "PlanPilot provides a range of powerful features including intuitive Kanban boards for visualizing workflow, robust sprint planning tools for agile teams, comprehensive reporting for data-driven decisions, customizable workflows, time tracking, and team collaboration tools. These features work seamlessly together to enhance your project management experience.",
  },
  {
    question: "Can PlanPilot handle multiple projects simultaneously?",
    answer:
      "Yes, PlanPilot is built to manage multiple projects concurrently. You can easily switch between projects, and get a bird's-eye view of all your ongoing work. This makes PlanPilot ideal for organizations juggling multiple projects or clients.",
  },
  {
    question: "Is there a learning curve for new users?",
    answer:
      "While PlanPilot is packed with features, we've designed it with user-friendliness in mind. New users can quickly get up to speed thanks to our intuitive interface, helpful onboarding process, and comprehensive documentation.",
  },
];

const features = [
  {
    title: "Intuitive Kanban Boards",
    description:
      "Visualize your workflow and optimize team productivity with our easy-to-use Kanban boards.",
    icon: Layout,
  },
  {
    title: "Powerful Sprint Planning",
    description:
      "Plan and manage sprints effectively, ensuring your team stays focused on delivering value.",
    icon: Calendar,
  },
  {
    title: "Comprehensive Reporting",
    description:
      "Gain insights into your team's performance with detailed, customizable reports and analytics.",
    icon: BarChart,
  },
];

const handleSubscriptionPayment = async (amount, plan) => {
  const res = await loadRazorpay();
  if (!res) {
    alert("Failed to load Razorpay SDK.");
    return;
  }

  const options = {
    key: "rzp_test_FazbAhuf9IFRQn", 
    amount: amount * 100, 
    currency: "INR",
    name: "PlanPilot",
    description: `${plan} Subscription`,
    handler: function (response) {
      alert(
        `Payment successful! Payment ID: ${response.razorpay_payment_id}`
      );
    },
    prefill: {
      name: "Your Name",
      email: "email@example.com",
    },
    theme: {
      color: "#1e40af",
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="container mx-auto py-20 text-center">
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold gradient-title pb-6 flex flex-col">
          Streamline Your Workflow <br />
          <span className="flex mx-auto gap-3 sm:gap-4 items-center">
            with PlanPilot
          </span>
        </h1>
        <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
          Empower your team with our intuitive project management solution.
        </p>
        <Link to="/onboarding">
          <Button size="lg" className="mr-4">
            Get Started <ChevronRight size={18} className="ml-1" />
          </Button>
        </Link>
        <a href="#features">
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </a>
      </section>

      <section id="features" className="bg-gray-900 py-20 px-5">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">Key Features</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-800">
                <CardContent className="pt-6">
                  <feature.icon className="h-12 w-12 mb-4 text-blue-300" />
                  <h4 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">
            Trusted by Industry Leaders
          </h3>
          <CompanyCarousel />
        </div>
      </section>

      <section className="bg-gray-950 py-20 px-5">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-10 text-white">
            Choose Your Subscription Plan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <Card className="bg-gray-800 text-white text-left">
              <CardContent className="p-6">
                <h4 className="text-2xl font-bold mb-2">Basic Plan</h4>
                <p className="mb-4 text-gray-300">₹199/month</p>
                <ul className="mb-6 space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-400" />
                    Up to 3 Projects
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-400" />
                    Kanban Board Access
                  </li>
                </ul>
                <Button
                  className="w-full"
                  onClick={() => handleSubscriptionPayment(199, "Basic")}
                >
                  Subscribe
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 text-white text-left border-2 border-blue-400">
              <CardContent className="p-6">
                <h4 className="text-2xl font-bold mb-2">Pro Plan</h4>
                <p className="mb-4 text-gray-300">₹499/month</p>
                <ul className="mb-6 space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-400" />
                    Unlimited Projects
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-400" />
                    Sprint Planning
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-400" />
                    Team Collaboration
                  </li>
                </ul>
                <Button
                  className="w-full"
                  onClick={() => handleSubscriptionPayment(499, "Pro")}
                >
                  Subscribe
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 text-white text-left">
              <CardContent className="p-6">
                <h4 className="text-2xl font-bold mb-2">Enterprise Plan</h4>
                <p className="mb-4 text-gray-300">₹999/month</p>
                <ul className="mb-6 space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-400" />
                    Everything in Pro +
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-400" />
                    Advanced Reporting
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-400" />
                    Custom Workflows
                  </li>
                </ul>
                <Button
                  className="w-full"
                  onClick={() => handleSubscriptionPayment(999, "Enterprise")}
                >
                  Subscribe
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-gray-900 py-20 px-5">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">
            Frequently Asked Questions
          </h3>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="py-20 text-center px-5">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-6">
            Ready to Transform Your Workflow?
          </h3>
          <p className="text-xl mb-12">
            Join thousands of teams already using PlanPilot to streamline their
            projects and boost productivity.
          </p>
          <Link to="/onboarding">
            <Button size="lg" className="animate-bounce">
              Start For Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
