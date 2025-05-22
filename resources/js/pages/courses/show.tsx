import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Course {
  id: number;
  name: string;
  students: Array<{
    id: number;
    name: string;
    has_signed?: boolean;
  }>;
}
  

export default function CourseShow() {
  const course = usePage().props as unknown as Course;
  const [qrHtml, setQrHtml] = useState('');

  const generateQR = () => {
    axios.post('/courses/generate-token', { course_id: course.id }).then(res => {
      setQrHtml(res.data.qr);
    });
  };

  useEffect(() => {
    console.log(course);
    generateQR(); 
    const interval = setInterval(() => {
      generateQR(); 
    }, 2 * 60 * 1000);

    return () => clearInterval(interval); // nettoyage
  });

  return (
    <div>
      <h1>{course.name}</h1>
      <button onClick={generateQR}>Régénérer manuellement le QR code</button>
      <div className="mt-4" dangerouslySetInnerHTML={{ __html: qrHtml }} />
      <h2>Étudiants inscrits</h2>
      <ul>
        {course.students.map((student: { id: number; name: string; has_signed?: boolean }) => (
          <li key={student.id}>
            {student.name} {student.has_signed ? '✅ Présent' : '❌ Absent'}
          </li>
        ))}
      </ul>
    </div>
  );
}