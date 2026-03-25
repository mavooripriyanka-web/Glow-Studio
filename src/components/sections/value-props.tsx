import { Leaf, Droplets, Recycle, BrainCircuit } from "lucide-react";

const values = [
    {
        icon: BrainCircuit,
        title: 'Holistic Approach',
        description: 'We blend modern science with traditional wellness for a complete mind-body experience.'
    },
    {
        icon: Leaf,
        title: 'Natural Ingredients',
        description: 'Our treatments feature high-quality, ethically-sourced botanicals and minerals.'
    },
    {
        icon: Recycle,
        title: 'Personalized Care',
        description: 'Every treatment is tailored to your unique needs and wellness goals.'
    }
]

export default function ValueProps() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {values.map((value) => (
                <div key={value.title} className="flex flex-col items-center space-y-4">
                    <div className="bg-secondary p-4 rounded-full">
                        <value.icon className="w-10 h-10 text-primary"/>
                    </div>
                    <h3 className="text-xl font-bold font-headline">{value.title}</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto">{value.description}</p>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
