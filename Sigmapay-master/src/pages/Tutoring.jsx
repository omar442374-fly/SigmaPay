import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Tutoring() {
    const [progress, setProgress] = useState(0);
    const [topics, setTopics] = useState([
        { id: 1, title: 'Budgeting', completed: false },
        { id: 2, title: 'Investing', completed: false },
        { id: 3, title: 'Debt Management', completed: false },
    ]);
    const [quizResults, setQuizResults] = useState(null);
    const [resources, setResources] = useState([
        { id: 1, type: 'article', title: 'How to Budget Effectively', link: '#' },
        { id: 2, type: 'video', title: 'Investing Basics', link: '#' },
        { id: 3, type: 'tool', title: 'Debt Repayment Calculator', link: '#' },
    ]);

    useEffect(() => {
        // Simulate fetching progress and quiz results from an API
        setProgress(50); // Example: 50% progress
        setQuizResults({
            strengths: ['Budgeting'],
            weaknesses: ['Investing'],
        });
    }, []);

    const handleTopicCompletion = (id) => {
        setTopics((prevTopics) =>
            prevTopics.map((topic) =>
                topic.id === id ? { ...topic, completed: !topic.completed } : topic
            )
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-8">
                <h1 className="text-2xl font-semibold text-gray-900">Financial Education</h1>

                {/* Progress Tracking */}
                <div className="mt-4">
                    <h2 className="text-xl font-semibold">Learning Progress</h2>
                    <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                        <div
                            className="bg-blue-600 h-4 rounded-full"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="mt-2 text-gray-600">{progress}% completed</p>
                </div>

                {/* Topics */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold">Topics</h2>
                    <ul className="mt-4 space-y-4">
                        {topics.map((topic) => (
                            <li
                                key={topic.id}
                                className="flex items-center justify-between p-4 bg-white shadow rounded-lg"
                            >
                                <span>{topic.title}</span>
                                <button
                                    onClick={() => handleTopicCompletion(topic.id)}
                                    className={`px-4 py-2 rounded-lg text-white ${topic.completed ? 'bg-green-500' : 'bg-gray-500'
                                        }`}
                                >
                                    {topic.completed ? 'Completed' : 'Mark as Complete'}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Quiz Results */}
                {quizResults && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold">Personalized Learning Path</h2>
                        <p className="mt-2 text-gray-600">
                            Strengths: {quizResults.strengths.join(', ')}
                        </p>
                        <p className="mt-2 text-gray-600">
                            Weaknesses: {quizResults.weaknesses.join(', ')}
                        </p>
                    </div>
                )}

                {/* Resource Library */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold">Resource Library</h2>
                    <ul className="mt-4 space-y-4">
                        {resources.map((resource) => (
                            <li
                                key={resource.id}
                                className="p-4 bg-white shadow rounded-lg flex justify-between items-center"
                            >
                                <span>{resource.title}</span>
                                <Link
                                    to={resource.link}
                                    className="text-blue-600 hover:underline"
                                >
                                    View {resource.type}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Gamification */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold">Achievements</h2>
                    <p className="mt-2 text-gray-600">Earn badges as you complete topics!</p>
                    <div className="mt-4 flex space-x-4">
                        <div className="p-4 bg-yellow-100 text-yellow-600 rounded-lg shadow">
                            Beginner Badge
                        </div>
                        <div className="p-4 bg-green-100 text-green-600 rounded-lg shadow">
                            Intermediate Badge
                        </div>
                        <div className="p-4 bg-blue-100 text-blue-600 rounded-lg shadow">
                            Expert Badge
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Tutoring;