import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './coursePages.css';

const CoursePresentation = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');

    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMaterials = async () => {
            if (!id) return;

            try {
                const response = await fetch(`http://localhost:5271/api/StudyMaterial/GetStudyMaterialsForSubject/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setMaterials(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMaterials();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Gruparea materialelor după dată
    const groupedMaterials = materials.reduce((groups, material) => {
        const date = material.CreatedOn;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(material);
        return groups;
    }, {});

    return (
        <div className="content-course">
            <h1 className="title">Course Materials</h1>
            {materials.length === 0 ? (
                <h2 className='no-items-with-space'>No study materials yet.</h2>
            ) : (
                Object.keys(groupedMaterials).map((date, index) => (
                    <div key={date} className="material-group">
                        <h2 className="material-date">{date}</h2>
                        {groupedMaterials[date].map((material, materialIndex) => {
                            // Crearea URL-ului data-uri pentru descărcare/vizualizare
                            const fileUrl = `data:application/octet-stream;base64,${material.FileContent}`;

                            return (
                                <div key={material.id} className="material-item">
                                    <h2 className="material-title">{material.Title}</h2>
                                    <p className="material-description">{material.Description}</p>
                                    {material.FileName && (
                                        <a href={fileUrl} download={material.FileName} className="material-download">
                                            {material.FileName}
                                        </a>
                                    )}
                                    {/* Adăugarea unei linii orizontale între materiale, cu excepția ultimului material din grup */}
                                    {materialIndex < groupedMaterials[date].length - 1 && <hr className="material-divider" />}
                                </div>
                            );
                        })}
                    </div>
                ))
            )}
        </div>
    );
};

export default CoursePresentation;
