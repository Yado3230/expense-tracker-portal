"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CreditCard,
  DollarSign,
  LineChart,
  PieChart,
  Wallet,
  Shield,
  Clock,
  Users,
  CheckCircle2,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const RootPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll for header background change
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header / App Bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md py-5" : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="flex items-center">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mr-3">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
                <span
                  className={`text-xl font-bold transition-colors ${
                    scrolled ? "text-gray-900" : "text-gray-900"
                  }`}
                >
                  Expense<span className="text-blue-600">Tracker</span>
                </span>
              </div>
            </Link>

            {/* Desktop Authentication Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="font-medium border-gray-200 text-gray-700 hover:text-blue-600 hover:border-blue-200"
              >
                <Link href="/auth/login">Log In</Link>
              </Button>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                <Link href="/dashboard">Get Started</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-md transition-colors ${
                  scrolled
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-gray-800 hover:bg-gray-200/20"
                }`}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
              <div className="pt-4 space-y-3">
                <Link
                  href="#features"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                >
                  Features
                </Link>
                <Link
                  href="#solutions"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                >
                  Solutions
                </Link>
                <Link
                  href="#testimonials"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                >
                  Testimonials
                </Link>
                <Link
                  href="#pricing"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                >
                  Pricing
                </Link>
                <div className="pt-4 flex flex-col space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-center font-medium border-gray-200 text-gray-700"
                  >
                    <Link href="/auth/login" className="w-full">
                      Log In
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    className="justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  >
                    <Link href="/dashboard" className="w-full">
                      Get Started
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content with top padding for header */}
      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 md:py-24">
          {/* Background Elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-blue-50 to-indigo-100 rounded-bl-[100px] opacity-70"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-indigo-50 to-blue-100 rounded-tr-[100px] opacity-70"></div>
          </div>

          {/* Hero Content */}
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 md:mb-20">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                Smart{" "}
                <span className="text-blue-600">Financial Management</span> for
                Everyone
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
                Take control of your finances with our intuitive expense
                tracking portal. Monitor spending, set budgets, and achieve your
                financial goals with ease.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-md shadow-lg hover:shadow-xl transition-all"
                >
                  <Link href="/dashboard" className="flex items-center">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-blue-600 border-blue-200 hover:border-blue-300 hover:bg-blue-50 font-medium px-6 py-2.5 rounded-md shadow-sm"
                >
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="max-w-5xl mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl blur-lg transform scale-105"></div>
              <div className="relative bg-white rounded-xl shadow-xl p-4 border border-gray-100">
                <div className="rounded-lg overflow-hidden p-3 bg-white">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-lg mb-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg">Financial Dashboard</h3>
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-500">
                          Total Expenses
                        </h4>
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                          <DollarSign className="h-4 w-4 text-blue-500" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold mt-2 text-gray-900">
                        $4,258
                      </p>
                      <div className="mt-3 flex items-center text-xs text-green-600">
                        <LineChart className="h-3 w-3 mr-1" />
                        <span>12% less than last month</span>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-500">
                          Budget Status
                        </h4>
                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
                          <Wallet className="h-4 w-4 text-indigo-500" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold mt-2 text-gray-900">
                        68%
                      </p>
                      <div className="mt-3 h-2 bg-gray-100 rounded-full">
                        <div className="h-2 bg-indigo-500 rounded-full w-[68%]"></div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Budget usage this month
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-500">
                          Savings Goal
                        </h4>
                        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                          <PieChart className="h-4 w-4 text-emerald-500" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold mt-2 text-gray-900">
                        $2,500
                      </p>
                      <div className="mt-3 flex items-center text-xs text-emerald-600">
                        <BarChart3 className="h-3 w-3 mr-1" />
                        <span>$875 saved this month</span>
                      </div>
                    </div>
                  </div>

                  {/* Chart Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                      <h4 className="font-medium mb-3 text-gray-700">
                        Expense Categories
                      </h4>
                      <div className="flex justify-center">
                        <div className="w-full h-32 flex items-end justify-between p-2">
                          {[35, 60, 45, 80, 25, 50].map((height, i) => (
                            <div
                              key={i}
                              className="w-8 flex flex-col items-center"
                            >
                              <div
                                className="w-full bg-gradient-to-t from-blue-500 to-indigo-500 rounded-t-md"
                                style={{ height: `${height}%` }}
                              ></div>
                              <span className="text-xs mt-1 text-gray-500">
                                {
                                  [
                                    "Food",
                                    "Rent",
                                    "Trans",
                                    "Utils",
                                    "Shop",
                                    "Other",
                                  ][i]
                                }
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                      <h4 className="font-medium mb-3 text-gray-700">
                        Recent Transactions
                      </h4>
                      <div className="space-y-2">
                        {[
                          {
                            title: "Grocery Shopping",
                            amount: "$84.50",
                            icon: "🛒",
                          },
                          {
                            title: "Monthly Rent",
                            amount: "$1,200.00",
                            icon: "🏠",
                          },
                          {
                            title: "Utility Bill",
                            amount: "$125.75",
                            icon: "⚡",
                          },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center">
                              <span className="mr-2 text-lg">{item.icon}</span>
                              <span className="font-medium text-sm text-gray-700">
                                {item.title}
                              </span>
                            </div>
                            <span className="font-medium text-sm text-gray-900">
                              {item.amount}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
                Features
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-gray-900">
                Everything You Need for Financial Success
              </h2>
              <p className="text-lg text-gray-600">
                Our expense tracker provides all the tools you need to manage
                your finances effectively
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">
                  Expense Tracking
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Easily log and categorize your expenses to see where your
                  money goes with detailed breakdowns and insights.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center mb-4">
                  <Wallet className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">
                  Budget Management
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Create and manage budgets by category to stay on track with
                  your spending goals and financial limits.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center mb-4">
                  <BarChart3 className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">
                  Financial Analytics
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Gain insights through visual reports and analytics that help
                  you understand your spending patterns.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center mb-4">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">
                  Multi-User Support
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Share access with family members or financial advisors to
                  collaborate on financial management.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center mb-4">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">
                  Transaction History
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Keep a comprehensive record of all your transactions with
                  advanced search and filtering capabilities.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center mb-4">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">
                  Secure Platform
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Your financial data is protected with enterprise-grade
                  security and regular backups for peace of mind.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
                By The Numbers
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-3 text-gray-900">
                Why Users Trust Our Platform
              </h2>
              <p className="text-lg text-gray-600">
                Join thousands of users who have transformed their financial
                habits
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">87%</div>
                <p className="text-base text-gray-600">
                  Users report better spending awareness
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  $526
                </div>
                <p className="text-base text-gray-600">
                  Average monthly savings per user
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">
                  32%
                </div>
                <p className="text-base text-gray-600">
                  Reduction in unnecessary expenses
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  5min
                </div>
                <p className="text-base text-gray-600">
                  Average daily time needed for tracking
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section id="testimonials" className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 bg-gradient-to-br from-blue-600 to-indigo-600 p-8 flex items-center justify-center">
                  <div className="text-6xl">💰</div>
                </div>
                <div className="p-6 md:p-8 md:w-2/3">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-600 font-medium text-xs mb-2">
                      Success Story
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">
                      Financial Freedom Achieved
                    </h3>
                  </div>
                  <p className="text-base md:text-lg text-gray-600 mb-5 italic leading-relaxed">
                    &ldquo;This expense tracker has completely changed how I
                    manage my finances. I&apos;ve finally been able to save for
                    my dream vacation and pay off debt. The visual reports make
                    it easy to see where I can cut back.&rdquo;
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl mr-3">
                      👩
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold text-sm">
                        Sarah Johnson
                      </p>
                      <p className="text-gray-500 text-xs">
                        Using Expense Tracker for 8 months
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="pricing" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex items-center">
                <div className="p-6 md:p-8 md:w-3/5">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    Start Your Financial Journey Today
                  </h2>
                  <p className="text-blue-100 mb-6 text-base">
                    Join thousands of users who have transformed their financial
                    habits with our platform.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      size="default"
                      className="bg-white text-blue-600 hover:bg-gray-100 font-medium px-5 py-2 rounded-md"
                    >
                      <Link href="/dashboard">Get Started Now</Link>
                    </Button>
                    <Button
                      size="default"
                      variant="outline"
                      className="border-white text-white hover:bg-white/10 font-medium px-5 py-2 rounded-md"
                    >
                      <Link href="/auth/login">Sign In</Link>
                    </Button>
                  </div>
                </div>
                <div className="hidden md:block md:w-2/5 p-8">
                  <div className="relative">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full translate-x-1/3 -translate-y-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -translate-x-1/3 translate-y-1/3"></div>
                    <div className="relative bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20">
                      <div className="space-y-3">
                        {[
                          {
                            title: "Easy expense tracking",
                            icon: (
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            ),
                          },
                          {
                            title: "Smart budget planning",
                            icon: (
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            ),
                          },
                          {
                            title: "Insightful reports",
                            icon: (
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            ),
                          },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center space-x-3">
                            <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center">
                              {item.icon}
                            </div>
                            <p className="text-white text-sm">{item.title}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900">
                Expense <span className="text-blue-600">Tracker</span> Portal
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Take control of your financial journey today
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-6">
                <Link
                  href="/auth/login"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
              <p className="mt-6 text-gray-500 text-xs">
                © {new Date().getFullYear()} Expense Tracker. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default RootPage;
