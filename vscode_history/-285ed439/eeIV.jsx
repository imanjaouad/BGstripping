import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Groupes() {
    const [groupes, setGroupes] = useState([]);
    const [filieres, setFilieres] = useState([]); // لستة الشعب من الداتابيز
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const initialForm = {
        id_groupe: null,
        code_groupe: '',
        id_filiere: '', // مربوط بالداتابيز
        annee_formation: 1,
        nbr_semaines: 35,
        mh_hebdo: '',
        mh_annuelle: '',
        statut: 'actif',
        fusion_status: 'non',
        type_formation: 'R',
        id_efp: 1, // ISTA BENGUERIR
        id_proprietaire: 1 // admin1
    };
    const [formData, setFormData] = useState(initialForm);

    // 1. جلب البيانات (الكروبات + الشعب)
    const fetchData = async () => {
        try {
            const [gRes, fRes] = await Promise.all([
                fetch('/api/groupes').then(r => r.json()),
                fetch('/api/filieres').then(r => 