import React from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { terms } from '../../services/api';

const ScheduleSetup = () => {
    const [config, setConfig] = React.useState({
        termName: '',
        startDate: '',
        endDate: '',
        defaultDuration: 45
    });
    const [loading, setLoading] = React.useState(false);

    const termOptions = [
        { value: 'Fall 2023', label: 'Fall 2023' },
        { value: 'Spring 2024', label: 'Spring 2024' },
        { value: 'Fall 2024', label: 'Fall 2024' },
        { value: 'Spring 2025', label: 'Spring 2025' },
    ];

    React.useEffect(() => {
        fetchTermConfig();
    }, []);

    const fetchTermConfig = async () => {
        try {
            const data = await terms.get();
            if (data && data.name) {
                setConfig({
                    termName: data.name,
                    startDate: data.startDate ? data.startDate.split('T')[0] : '',
                    endDate: data.endDate ? data.endDate.split('T')[0] : '',
                    defaultDuration: data.defaultDuration || 45
                });
            }
        } catch (error) {
            console.error('Failed to fetch term config:', error);
        }
    };

    const handleSave = async () => {
        if (!config.termName || !config.startDate || !config.endDate) {
            alert('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                name: config.termName,
                startDate: config.startDate,
                endDate: config.endDate,
                defaultDuration: config.defaultDuration
            };

            await terms.save(payload);
            alert('Configuration saved successfully!');
        } catch (error) {
            console.error('Error saving config:', error);
            alert(`Failed to save configuration: ${error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">Schedule Setup</h1>
                <p className="text-gray-500">Configure your academic term details</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <Select
                    label="Current Academic Term"
                    options={termOptions}
                    placeholder="Select Term"
                    value={config.termName}
                    onChange={(val) => setConfig({ ...config, termName: val })}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        type="date"
                        label="Term Start Date"
                        value={config.startDate}
                        onChange={(e) => setConfig({ ...config, startDate: e.target.value })}
                    />
                    <Input
                        type="date"
                        label="Term End Date"
                        value={config.endDate}
                        onChange={(e) => setConfig({ ...config, endDate: e.target.value })}
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Default Class Duration</h3>
                    <div className="flex gap-4">
                        {[45, 60, 90].map((duration) => (
                            <button
                                key={duration}
                                onClick={() => setConfig({ ...config, defaultDuration: duration })}
                                className={`flex-1 py-2 px-4 border rounded-lg font-medium transition-colors ${config.defaultDuration === duration
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {duration} mins
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-4">
                    <Button fullWidth onClick={handleSave} loading={loading}>
                        Save Configuration
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleSetup;
