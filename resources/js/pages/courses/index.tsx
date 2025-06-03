import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Course } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mes cours',
        href: '/courses',
    },
];

export default function CourseList() {
    const { courses } = usePage().props;


    const deleteCourse = async (courseId: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
            try {
                await axios.delete(`/courses/${courseId}`);
                // Optionally, you can refresh the page or update the state to reflect the deletion
                window.location.reload();
            } catch (error) {
                console.error('Erreur lors de la suppression du cours', error);
                alert('Erreur lors de la suppression du cours');
            }
        }
    }



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mes cours" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <ul id="course-list">
                    {
                        courses.length > 0 ? courses.map(course => (
                            <li key={course.id} className='flex flex-col justify-between '>
                                <Link href={route('courses.show', course.id)}>
                                    <span className='course-icon'>{course.icon}</span>
                                    <span className='course-name'>{course.name}</span>

                                </Link>
                                <button onClick={() => deleteCourse(course.id)} className='text-[var(--color-destructive-foreground)]'>Supprimer le cours</button>
                            </li>
                        ))
                            : <li>Aucun cours trouvé.</li>
                    }
                </ul>
            </div>
        </AppLayout>


    );
}
