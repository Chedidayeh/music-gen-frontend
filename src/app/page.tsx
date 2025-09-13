'use client'

import { ArrowRight, Music, CheckCircle, ChevronRight, Sparkles, Headphones, Mic, Download, Heart } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { GoogleLogin } from "~/app/actions"
import { Button } from "~/components/ui/button"

export default function Page() {
    const { status } = useSession()
    const isSignedIn = status === 'authenticated'
    const router = useRouter()

    const handleClick = async () => {
        try {
            await GoogleLogin();
        } catch (error) {
            console.error("An error occurred during Google Login:", error);
        }
    };

    const SignOutUser = () => {
        try {
            router.push("/api/auth/logout");
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <>
            <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                <Music className="w-5 h-5 text-white" />

                            </div>
                            <span className="text-xl font-bold text-gray-900">MelodyAI</span>

                        </div>
                        <div className="flex items-center gap-4">
                            {isSignedIn ? (
                                <div className="flex items-center justify-center gap-2">


                                    <Button asChild className="bg-purple-600 hover:bg-purple-700">
                                        <Link href="/dashboard">Dashboard</Link>
                                    </Button>
                                    <Button onClick={SignOutUser} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 cursor-pointer">
                                        Sign out
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <Button onClick={handleClick} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 cursor-pointer">
                                        Sign In
                                    </Button>
                                </>

                            )}

                        </div>

                    </div>
                </div>

            </nav>

            <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="group relative mx-auto flex w-fit items-center justify-center rounded-full px-4 py-1.5 bg-blue-50 border border-blue-200 transition-all duration-500 ease-out hover:bg-blue-100 mb-8">
                        <Sparkles className="w-4 h-4 mr-2 text-blue-600" />
                        <hr className="mx-2 h-4 w-px shrink-0 bg-blue-300" />
                        <ChevronRight
                            className="ml-1 w-4 h-4 stroke-blue-600 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5"
                        />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        Create Music with{' '}
                        <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700  bg-clip-text text-transparent">AI Magic</span>
                    </h1>
                    <p className="text-lg max-w-2xl mx-auto mb-8 text-gray-600">
                        Generate original songs from text descriptions, create custom lyrics, and produce professional-quality music with AI.
                        Turn your ideas into melodies instantly.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        {isSignedIn ? (
                            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 px-8 py-4" >
                                <Link href="/dashboard" className="group">
                                    <span>Start Creating</span>
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />

                                </Link>
                            </Button>
                        ) : (
                            <Button onClick={handleClick} size="lg" className="bg-purple-600 hover:bg-purple-700 px-8 py-4" >
                                <span>Start Creating</span>
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        )}

                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>Generate in seconds</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>Free forever plan</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Powerful AI Music Generation
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Create professional-quality music with advanced AI technology
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Mic className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Text-to-Music</h3>
                            <p className="text-gray-600">
                                Describe your song idea and let AI generate the perfect melody, rhythm, and arrangement.
                            </p>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Headphones className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom Lyrics</h3>
                            <p className="text-gray-600">
                                Write your own lyrics or let AI generate them based on your description and style preferences.
                            </p>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Download className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Download</h3>
                            <p className="text-gray-600">
                                Download your generated songs in high quality and use them for any project.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white">
                <div className="max-w-6xl mx-auto px-4 py-12">
                    <div className="grid md:grid-cols-4 gap-8">
                        {/* Brand Section */}
                        <div className="md:col-span-1">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                    <Music className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold">MelodyAI</span>
                            </div>
                            <p className="text-gray-400 text-sm mb-4">
                                Create professional-quality music with AI. Turn your ideas into melodies instantly.
                            </p>

                        </div>


                    </div>

                    {/* Bottom Section */}
                    <div className="border-t border-gray-800 mt-8 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-gray-400 text-sm">
                                © 2024 MelodyAI. All rights reserved.
                            </p>
                            <p className="text-gray-400 text-sm flex items-center mt-2 md:mt-0">
                                Made with <Heart className="w-4 h-4 text-red-500 mx-1" /> for creators
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}
