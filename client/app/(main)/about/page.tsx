import React from 'react'
import {Container} from "@/components/shared/container";
import {Title} from "@/components/shared/title";
import {Metadata} from "next";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ArrowRight, Code, Rocket, Heart, Sparkles} from "lucide-react";

export const metadata: Metadata = {
    title: "About Me | Emil Ibraimov",
    description: "Learn more about Emil Ibraimov - Front-end Developer",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen py-12">
            <Container>
                {/* Hero Section */}
                <section className="mb-20">
                    <div className="text-center mb-12">
                        <div className="inline-block mb-6">
                            <Sparkles className="w-16 h-16 text-blue-500 animate-pulse" />
                        </div>
                        <Title text="Hello, I'm Emil Ibraimov" size="2xl" className="font-bold mb-4 text-5xl"/>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                            A passionate front-end developer with 3.5 years of experience creating 
                            beautiful, responsive, and user-friendly web applications
                        </p>
                    </div>
                </section>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    {/* About Me */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Heart className="w-6 h-6 text-red-500" />
                            <Title text="About Me" size="2xl" className="font-bold"/>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            I'm a front-end developer specializing in React and Next.js, with a passion 
                            for solving complex problems and building clean, maintainable code. I love 
                            working with modern frameworks and continuously learning new technologies 
                            to stay at the forefront of web development.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            My expertise includes creating responsive user interfaces, implementing 
                            state management solutions, and optimizing application performance. I'm 
                            particularly interested in real-time applications, asynchronous operations, 
                            and creating seamless user experiences.
                        </p>
                    </div>

                    {/* What I Do */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Code className="w-6 h-6 text-blue-500" />
                            <Title text="What I Do" size="2xl" className="font-bold"/>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <h3 className="font-semibold mb-2">Front-end Development</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Building responsive and interactive user interfaces using React, Next.js, 
                                    and modern CSS frameworks
                                </p>
                            </div>
                            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <h3 className="font-semibold mb-2">State Management</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Implementing efficient state management with TanStack Query, Redux, 
                                    Zustand, and other modern solutions
                                </p>
                            </div>
                            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <h3 className="font-semibold mb-2">Performance Optimization</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Optimizing applications for speed, accessibility, and user experience
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skills & Experience */}
                <section className="mb-20">
                    <div className="flex items-center gap-3 mb-8">
                        <Rocket className="w-6 h-6 text-purple-500" />
                        <Title text="Skills & Experience" size="2xl" className="font-bold"/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800">
                            <h3 className="font-bold text-lg mb-3">Advanced</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Technologies I've mastered and use extensively in production applications
                            </p>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-800">
                            <h3 className="font-bold text-lg mb-3">Medium</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Technologies I'm comfortable with and continue to improve my skills in
                            </p>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl border border-orange-200 dark:border-orange-800">
                            <h3 className="font-bold text-lg mb-3">Learning</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Technologies I'm currently exploring and adding to my skill set
                            </p>
                        </div>
                    </div>
                </section>

                {/* Practices Section */}
                <section className="mb-20">
                    <Title text="My Practices" size="2xl" className="font-bold mb-6"/>
                    <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-2xl">
                        Practices are real-world examples of how I apply different technologies and 
                        frameworks. Each practice demonstrates my ability to work with specific tools 
                        like TanStack Query, Redux, Zustand, and more. Explore them to see my 
                        implementation skills in action.
                    </p>
                    <Link href="/">
                        <Button size="lg" className="group">
                            View All Practices
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </section>

                {/* CTA Section */}
                <section className="text-center p-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl">
                    <Title text="Let's Work Together" size="2xl" className="font-bold mb-4"/>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                        I'm always open to discussing new projects, creative ideas, or opportunities 
                        to be part of your visions.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/resume">
                            <Button size="lg" variant="default">
                                View Resume
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button size="lg" variant="outline">
                                Explore Skills
                            </Button>
                        </Link>
                    </div>
                </section>
            </Container>
        </div>
    )
}

