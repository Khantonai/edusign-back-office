import { Link, usePage } from '@inertiajs/react';

export default function CoursesIndex() {
  const { courses } = usePage().props;

  return (
    <div>
      <h1>Mes cours</h1>
      <ul>
        {courses.map(course => (
          <li key={course.id}>
            <Link href={route('courses.show', course.id)}>{course.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}