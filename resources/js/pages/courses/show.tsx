import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Course } from '@/types';


const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Mes cours',
    href: '/courses',
  },
  {
    title: 'Détails du cours',
    href: '/courses/[id]',
  },
];



export default function CourseShow() {
  const course = usePage().props.course as unknown as Course;
  const [tokenData, setTokenData] = useState('');
  const [students, setStudents] = useState(course.students);

  const generateQR = () => {
    axios.post('/courses/generate-token', { course_id: course.id }).then(res => {
      setTokenData(res.data);
    });
  };

  const refreshCourse = async () => {
    try {
      const res = await axios.get(`/api/courses/${course.id}`);
      setStudents(res.data.students);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du cours');
    }
  };

  const handleSign = async (studentId: number) => {
    try {
      await axios.post('/presence/prof-sign', {
        course_id: course.id,
        student_id: studentId
      });
      await refreshCourse();
      generateQR(); // refresh token & UI
    } catch (error) {
      alert('Erreur lors de la signature');
    }
  };

  const handleRevoke = async (studentId: number) => {
    try {
      await axios.post('/presence/revoke', {
        course_id: course.id,
        student_id: studentId
      });
      await refreshCourse();
      generateQR(); // refresh token & UI
    } catch (error) {
      alert('Erreur lors de la révocation');
    }
  };

  useEffect(() => {
    generateQR();
    const interval = setInterval(() => {
      generateQR();
    }, 2 * 60 * 1000);

    return () => clearInterval(interval); // nettoyage
  }, []);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div id='course-create-form'>


        <section id='course-creation'>
          <div>
            <span id='emoji-button'>{course.icon}</span>
          </div>

          <div style={{ width: '100%', display: "flex", justifyContent: "center", position: 'relative' }}>
            <p id="course-name">{course.name}</p>
          </div>

          <div id="qrcode" dangerouslySetInnerHTML={{ __html: tokenData.qr }} />

          <button onClick={generateQR} className='btn'>Régénérer manuellement le QR code</button>

        </section>

        <section id='students-selection'>
          <div className='flex flex-col justify-between align-center gap-4'>
            <div className='flex justify-between items-end'>
              <p>Étudiants inscrits</p>
              <button onClick={refreshCourse} className='btn'>Rafraîchir la liste</button>
            </div>
            <ul id='course-student-list'>
              {students.length > 0 ? students?.map((student: { id: number; name: string; has_signed?: boolean }) => (
                <li key={student.id} className='course-student-item'>
                  <span className='student-name'>{student.name}</span>
                  <div className='btn-cont'>
                    <span>{student.has_signed ? '✅ Présent' : '❌ Absent'}</span>
                    <button
                      onClick={() => student.has_signed ? handleRevoke(student.id) : handleSign(student.id)}
                      className={student.has_signed ? 'revoke-btn' : 'sign-btn'}
                    >
                      {student.has_signed ? "Annuler" : "Signer"}
                    </button>
                  </div>
                </li>
              ))
                : <p className='course-student-item'>Pas d'étudiants inscrits</p>
              }
            </ul>
          </div>
        </section>
      </div>
    </AppLayout>

  );
}