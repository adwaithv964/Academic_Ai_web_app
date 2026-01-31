import React from 'react';
import Icon from '../../components/AppIcon';

const Xtra = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Xtra Features</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-all cursor-pointer">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600">
                        <Icon name="Zap" size={32} />
                    </div>
                    <h3 className="font-bold text-gray-900">Power Mode</h3>
                    <p className="text-sm text-gray-500 mt-2">Boost productivity with advanced focus tools.</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-all cursor-pointer">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600">
                        <Icon name="Star" size={32} />
                    </div>
                    <h3 className="font-bold text-gray-900">Rewards</h3>
                    <p className="text-sm text-gray-500 mt-2">Earn points for completing study goals.</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-all cursor-pointer">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 text-pink-600">
                        <Icon name="Heart" size={32} />
                    </div>
                    <h3 className="font-bold text-gray-900">Wellness</h3>
                    <p className="text-sm text-gray-500 mt-2">Mindfulness and stress relief exercises.</p>
                </div>
            </div>
        </div>
    );
};

export default Xtra;
