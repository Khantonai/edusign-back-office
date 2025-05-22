import { useState, useEffect } from 'react';
import axios from 'axios';

type Student = {
  id: number;
  name: string;
};

export default function CourseManager() {
  const [courseName, setCourseName] = useState('');
  const [createdCourse, setCreatedCourse] = useState(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

  useEffect(() => {
    axios.get('/students')
      .then(res => setStudents(res.data))
      .catch(() => alert('Erreur lors du chargement des élèves.'));
  }, []);

  const createCourse = () => {
    axios.post('/courses/create', {
      name: courseName,
      student_ids: selectedStudents,
    }).then(res => setCreatedCourse(res.data.course));
  };

  return (
    <div>
      <h2>Créer un cours</h2>
      <input type="text" value={courseName} onChange={e => setCourseName(e.target.value)} placeholder="Nom du cours" />
      <select
        multiple
        value={selectedStudents.map(String)}
        onChange={e => {
          const options = Array.from(e.target.selectedOptions);
          setSelectedStudents(options.map(opt => Number(opt.value)));
        }}
      >
        {students.map(s => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>
      <button onClick={createCourse}>Créer</button>

      {createdCourse && (
        <>
          <h3>Cours créé : {createdCourse.name}</h3>
        </>
      )}
    </div>
  );
}