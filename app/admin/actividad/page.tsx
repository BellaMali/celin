"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import Link from "next/link";

type StockLog = {
    id: string;
    message: string;
    created_at: string;
};

export default function StockLogsPage() {
    const [logs, setLogs] = useState<StockLog[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchLogs = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("stock_logs")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching logs:", error);
        } else {
            setLogs(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold">Historial de Bajas de Stock</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Registros de acciones realizadas sobre el stock
                    </p>
                </div>
                <Link href="/employee/dashboard" className="btn btn-secondary">
                    Volver al Dashboard
                </Link>
            </div>

            {loading ? (
                <div className="flex items-center justify-center mt-8">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                </div>
            ) : logs.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-400 mt-8">
                    No hay registros disponibles.
                </p>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
                    {logs.map((log) => (
                        <div key={log.id} className="p-4">
                            <p className="text-sm text-gray-900 dark:text-white">{log.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {format(new Date(log.created_at), "dd/MM/yyyy HH:mm")}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
