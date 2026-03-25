import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Profile() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    // جلب الإعدادات من الداتابيز
    const fetchSettings = async () => {
        const res = await fetch('/api/settings').then(r => r.json());
        setSettings(res);
        setLoading(false);
    };

    useEffect(() => { fetchSettings(); }, []);

    // تحديث أي حقل في الداتابيز
    const save = async (data) => {
        const loadingToast = toast.loading('Mise à jour...');
        await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        toast.success('Enregistré dans SQL ⚡', { id: loadingToast });
        fetchSettings();
    };

    if (loading) return <div className="p-40 text-center font-black animate-pulse">LOADING PROFILE...</div>;

    return (
        <div className="p-8 pt-32 bg-[#f4f7f6] min-h-screen font-sans text-slate-800">
            <div className="max-w-4xl mx-auto space-y-6">
                
                {/* --- SECTION 1: MON PROFILE --- */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-sm">
                    <div className="bg-slate-50 p-4 border-b font-black uppercase text-xs tracking-widest text-slate-500">Mon Profile</div>
                    <div className="p-6 space-y-6">
                        {/* EFP */}
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Informations EFP :</label>
                            <div className="flex gap-2">
                                <input type="text" className="flex-1 p-2 border bg-slate-50 text-xs font-bold outline-none focus:border-teal-500" 
                                    defaultValue={settings.efp_name} onBlur={(e) => save({efp_name: e.target.value})} />
                                <button className="bg-[#00acc1] text-white p-2 px-4 shadow-md text-xs">💾</button>
                            </div>
                        </div>

                        {/* Compte */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-2 text-[10px] font-black text-gray-400 uppercase">Compte Admin :</div>
                            <input type="text" placeholder="Login" className="p-2 border bg-slate-50 text-xs font-bold" 
                                defaultValue={settings.login_admin} onBlur={(e) => save({login_admin: e.target.value})} />
                            <div className="flex gap-2">
                                <input type="password" placeholder="Mot de passe" className="flex-1 p-2 border bg-slate-50 text-xs font-bold" 
                                    defaultValue={settings.password_admin} onBlur={(e) => save({password_admin: e.target.value})} />
                                <button className="bg-[#00acc1] text-white p-2 px-4 shadow-md text-xs">Enregistrer</button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-green-600 font-bold text-xs cursor-pointer hover:underline">
                            <span className="text-lg">📞</span> Rejoindre groupe whatsapp
                        </div>
                    </div>
                </div>

                {/* --- SECTION 2: PERSONNALISATION --- */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-6">
                    <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Personnaliser la barre d'outils :</label>
                    <div className="flex gap-2">
                        <select className="flex-1 p-2 border bg-slate-50 text-xs font-bold" value={settings.toolbar_color} onChange={(e) => save({toolbar_color: e.target.value})}>
                            <option value="vert">Vert (Teal)</option>
                            <option value="bleu">Bleu Ocean</option>
                            <option value="noir">Noir Professional</option>
                        </select>
                        <button className="bg-amber-500 text-white px-6 text-xs font-black uppercase">Valider</button>
                    </div>
                </div>

                {/* --- SECTION 3: ESPACE SURVEILLANT (Accordion) --- */}
                <details className="bg-white border border-slate-200 shadow-sm rounded-sm group">
                    <summary className="bg-indigo-50 p-4 font-black uppercase text-xs tracking-widest text-indigo-600 cursor-pointer flex justify-between items-center list-none">
                        <span>Espace Surveillant</span>
                        <span className="group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="p-6 grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Login Surveillant" className="p-2 border bg-slate-50 text-xs font-bold" 
                            defaultValue={settings.surveillant_login} onBlur={(e) => save({surveillant_login: e.target.value})} />
                        <div className="flex gap-2">
                            <input type="password" placeholder="Pass" className="flex-1 p-2 border bg-slate-50 text-xs font-bold" 
                                defaultValue={settings.surveillant_pass} onBlur={(e) => save({surveillant_pass: e.target.value})} />
                            <button className="bg-[#00acc1] text-white px-4 text-xs">💾</button>
                        </div>
                    </div>
                </details>

                {/* --- SECTION 4: IMPRESSION (Footer Settings) --- */}
                <details className="bg-white border border-slate-200 shadow-sm rounded-sm group" open>
                    <summary className="bg-slate-50 p-4 font-black uppercase text-xs tracking-widest text-slate-500 cursor-pointer flex justify-between items-center list-none border-b">
                        <span>Configuration Impression (PDF)</span>
                        <span className="group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="p-6 space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Année Scolaire :</label>
                            <div className="flex gap-2">
                                <input type="text" className="flex-1 p-2 border bg-slate-50 text-xs font-bold" defaultValue={settings.impression_annee} onBlur={(e) => save({impression_annee: e.target.value})} />
                                <button className="bg-[#00acc1] text-white px-4">💾</button>
                            </div>
                        </div>

                        {/* Pied de page Groupes */}
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-black text-[#006064] border-b pb-1 uppercase">Pied de page Emploi Groupe</h4>
                            <input type="text" placeholder="NB: Notes additionnelles" className="w-full p-2 border text-xs italic bg-slate-50" defaultValue={settings.pied_groupe_nb} onBlur={(e) => save({pied_groupe_nb: e.target.value})} />
                            <div className="grid grid-cols-3 gap-2">
                                <input type="text" placeholder="Zone Gauche" className="p-2 border text-[10px]" defaultValue={settings.pied_groupe_gauche} onBlur={(e) => save({pied_groupe_gauche: e.target.value})} />
                                <input type="text" placeholder="Zone Milieu" className="p-2 border text-[10px]" defaultValue={settings.pied_groupe_milieu} onBlur={(e) => save({pied_groupe_milieu: e.target.value})} />
                                <input type="text" placeholder="Zone Droit" className="p-2 border text-[10px]" defaultValue={settings.pied_groupe_droit} onBlur={(e) => save({pied_groupe_droit: e.target.value})} />
                            </div>
                        </div>
                    </div>
                </details>

            </div>
        </div>
    );
}