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

  const generateQR = () => {
    axios.post('/courses/generate-token', { course_id: course.id }).then(res => {
      setTokenData(res.data);
    });
  };

  const handleSign = async (studentId: number) => {
    try {
      await axios.post('/presence/prof-sign', {
        course_id: course.id,
        student_id: studentId
      });
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
          <div style={{display: "flex", flexDirection: "column", overflow: "hidden"}}>
            <p>Étudiants inscrits</p>
            <ul id='course-student-list'>
              {course?.students?.map((student: { id: number; name: string; has_signed?: boolean }) => (
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
              ))}
            </ul>
          </div>
        </section>
      </div>
    </AppLayout>

  );
}