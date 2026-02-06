import HeroAnimation from '@/components/ChipScroll';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'MacFix Pro | Expert MacBook Repairs',
    description: 'Professional MacBook repair services. Screen replacements, battery repairs, logic board fixes, and more. Fast turnaround, quality parts.',
};

export default function Home() {
    return (
        <main className="bg-black text-white overflow-x-hidden">
            {/* Hero Section with Animation */}
            <HeroAnimation />

            {/* Services Section */}
            <section className="py-24 md:py-32 bg-gradient-to-b from-black to-zinc-950">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <p className="text-blue-400 text-sm uppercase tracking-[0.3em] mb-4">What We Do</p>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                            Expert Repairs for Every Issue
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: '🖥️',
                                title: 'Screen Replacement',
                                desc: 'Cracked or damaged displays replaced with genuine parts. Same-day service available.',
                                price: 'From $299'
                            },
                            {
                                icon: '🔋',
                                title: 'Battery Service',
                                desc: 'Restore your MacBook\'s all-day battery life with our certified replacements.',
                                price: 'From $149'
                            },
                            {
                                icon: '💾',
                                title: 'Data Recovery',
                                desc: 'Lost files? We recover data from failed drives and damaged systems.',
                                price: 'From $199'
                            },
                            {
                                icon: '🔧',
                                title: 'Logic Board Repair',
                                desc: 'Component-level repairs for liquid damage and complex failures.',
                                price: 'From $349'
                            },
                            {
                                icon: '⌨️',
                                title: 'Keyboard Repair',
                                desc: 'Sticky keys or unresponsive keyboard? We fix all models including butterfly.',
                                price: 'From $249'
                            },
                            {
                                icon: '⚡',
                                title: 'Performance Upgrade',
                                desc: 'SSD upgrades and RAM expansion to breathe new life into your Mac.',
                                price: 'From $179'
                            },
                        ].map((service, i) => (
                            <div
                                key={i}
                                className="group p-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-300"
                            >
                                <span className="text-4xl mb-4 block">{service.icon}</span>
                                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                                    {service.desc}
                                </p>
                                <p className="text-white font-semibold">{service.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-24 md:py-32 bg-zinc-950">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <p className="text-blue-400 text-sm uppercase tracking-[0.3em] mb-4">Why MacFix Pro</p>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                                Trusted by Thousands
                            </h2>
                            <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                                We're not just another repair shop. Our technicians are Apple-trained with years of experience handling the most complex repairs. We use only genuine and high-quality parts, backed by our satisfaction guarantee.
                            </p>

                            <div className="space-y-4">
                                {[
                                    { num: '50,000+', label: 'Devices Repaired' },
                                    { num: '98%', label: 'Success Rate' },
                                    { num: '24hrs', label: 'Average Turnaround' },
                                    { num: '90 Days', label: 'Warranty on All Repairs' },
                                ].map((stat, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <span className="text-3xl font-bold text-white">{stat.num}</span>
                                        <span className="text-zinc-500">{stat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-8xl mb-4">💻</div>
                                    <p className="text-zinc-400">Your MacBook in Expert Hands</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-24 md:py-32 bg-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <p className="text-blue-400 text-sm uppercase tracking-[0.3em] mb-4">How It Works</p>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                            Simple. Fast. Reliable.
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { step: '01', title: 'Book Online', desc: 'Schedule your repair in under 2 minutes' },
                            { step: '02', title: 'Free Diagnosis', desc: 'We identify the issue at no cost' },
                            { step: '03', title: 'Expert Repair', desc: 'Our technicians fix your device' },
                            { step: '04', title: 'Pick Up', desc: 'Get your MacBook back, like new' },
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <div className="text-6xl font-bold text-zinc-800 mb-4">{item.step}</div>
                                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                <p className="text-zinc-500 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 md:py-32 bg-zinc-950">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <p className="text-blue-400 text-sm uppercase tracking-[0.3em] mb-4">Reviews</p>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                            What Our Customers Say
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                name: 'Sarah Johnson',
                                role: 'Designer',
                                text: 'They saved my MacBook Pro after a coffee spill. Thought it was dead but they brought it back. Amazing service!',
                                rating: 5
                            },
                            {
                                name: 'Michael Chen',
                                role: 'Developer',
                                text: 'Fast turnaround on my screen replacement. Looks perfect and the price was fair. Highly recommend.',
                                rating: 5
                            },
                            {
                                name: 'Emily Davis',
                                role: 'Photographer',
                                text: 'Recovered 5 years of photos from my failed drive. These guys are miracle workers. Forever grateful!',
                                rating: 5
                            },
                        ].map((review, i) => (
                            <div key={i} className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: review.rating }).map((_, j) => (
                                        <span key={j} className="text-yellow-400">★</span>
                                    ))}
                                </div>
                                <p className="text-zinc-300 mb-6 leading-relaxed">&ldquo;{review.text}&rdquo;</p>
                                <div>
                                    <p className="font-semibold">{review.name}</p>
                                    <p className="text-zinc-500 text-sm">{review.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 md:py-32 bg-gradient-to-b from-zinc-950 to-black">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                        Ready to Fix Your Mac?
                    </h2>
                    <p className="text-zinc-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                        Get a free diagnosis and quote. Most repairs completed same-day.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-colors">
                            Book a Repair
                        </button>
                        <button className="px-8 py-4 bg-transparent border border-zinc-700 text-white font-semibold rounded-full hover:border-zinc-500 transition-colors">
                            Contact Us
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-black border-t border-zinc-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-8 mb-12">
                        <div>
                            <h3 className="text-xl font-bold mb-4">MacFix Pro</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">
                                Expert MacBook repairs since 2015. Trusted by professionals worldwide.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Services</h4>
                            <ul className="space-y-2 text-zinc-500 text-sm">
                                <li className="hover:text-white cursor-pointer transition-colors">Screen Repair</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Battery Replacement</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Data Recovery</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Logic Board Repair</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-zinc-500 text-sm">
                                <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Locations</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
                                <li className="hover:text-white cursor-pointer transition-colors">Blog</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Contact</h4>
                            <ul className="space-y-2 text-zinc-500 text-sm">
                                <li>contact@macfixpro.com</li>
                                <li>+1 (555) 123-4567</li>
                                <li>123 Tech Street, SF</li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-zinc-600 text-sm">© 2024 MacFix Pro. All rights reserved.</p>
                        <div className="flex gap-6 text-zinc-600 text-sm">
                            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
                            <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
                            <span className="hover:text-white cursor-pointer transition-colors">Cookies</span>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
