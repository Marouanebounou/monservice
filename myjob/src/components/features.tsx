import { ShieldCheck, MessageCircle, Clock, AlertTriangle } from 'lucide-react';

const features = [
  {
    title: "Secure Payments",
    description: "Payments are protected and only released when the work is approved.",
    icon: ShieldCheck,
  },
  {
    title: "Real-Time Messaging",
    description: "Chat instantly with freelancers and clients directly on the platform.",
    icon: MessageCircle,
  },
  {
    title: "Work Tracking",
    description: "Track progress, review work logs, and manage milestones with ease.",
    icon: Clock,
  },
  {
    title: "Dispute Resolution",
    description: "Fair dispute handling ensures both sides are protected at all times.",
    icon: AlertTriangle,
  },
];

export default function ToolsFeaturesSection() {
  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Tools & Features</h2>
        <p className="text-gray-600 mb-12">Empowering freelancers and clients to work better, together.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300">
              <feature.icon className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
