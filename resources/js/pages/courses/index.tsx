import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Course } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mes cours',
        href: '/courses',
    },
];

export default function CourseList() {
    const { courses } = usePage().props;


    console.log('Courses:', courses);



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mes cours" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <ul id="course-list">
                    {
                        courses.length > 0 ? courses.map(course => (
                            <li key={course.id}>
                                <Link href={route('courses.show', course.id)}>
                                    <span className='course-icon'>{course.icon}</span>
                                    <span className='course-name'>{course.name}</span>

                                </Link>
                            </li>
                        ))
                            : <li>Aucun cours trouvé.</li>
                    }
                </ul>
            </div>
        </AppLayout>


    );
}
