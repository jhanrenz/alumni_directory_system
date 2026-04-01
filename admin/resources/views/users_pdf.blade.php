<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Alumni Directory</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 12px;
            color: #333;
            background: #ffffff;
            margin: 0;
            padding: 20px;
        }

        h1 {
            text-align: center;
            font-size: 22px;
            color: #111827;
            margin-bottom: 10px;
        }

        /* Header Info Box */
        .report-header {
            border: 1px solid #d1d5db;
            padding: 10px;
            margin-bottom: 15px;
        }

        .report-header table {
            width: 100%;
            border: none;
        }

        .report-header td {
            border: none;
            padding: 4px 6px;
            font-size: 12px;
        }

        /* Main Table */
        table {
            width: 100%;
            border-collapse: collapse;
            background: #ffffff;
        }

        thead {
            background-color: #f3f4f6;
            color: #4b5563;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 11px;
        }

        th, td {
            padding: 10px 12px;
            text-align: left;
            border: 1px solid #d1d5db;
        }

        td img {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 4px;
        }

        .no-image {
            width: 50px;
            height: 50px;
            background: #e5e7eb;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #9ca3af;
            font-size: 10px;
            border-radius: 4px;
        }

        .footer {
            text-align: center;
            font-size: 10px;
            color: #6b7280;
            margin-top: 20px;
        }
    </style>
</head>
<body>

    <h1>Alumni Directory</h1>

    <!-- Report Header -->
    <div class="report-header">
        <table>
            <tr>
                <td>
                    <strong>Course:</strong> {{ $courseName ?? 'All Courses' }}
                </td>
                <td>
                    <strong>Year:</strong> {{ $yearName ?? 'All Years' }}
                </td>
                <td style="text-align: right;">
                    <strong>Total Records:</strong> {{ count($users) }}
                </td>
            </tr>
        </table>
    </div>

    <!-- Alumni Table -->
    <table>
        <thead>
            <tr>
                <th style="width: 70px;">Image</th>
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
                <th style="width: 80px;">Year</th>
            </tr>
        </thead>
        <tbody>
            @forelse($users as $user)
                <tr>
                    <td>
                        @if($user->image)
                            <img src="{{ public_path('storage/' . $user->image) }}" alt="{{ $user->name }}">
                        @else
                            <div class="no-image">No Image</div>
                        @endif
                    </td>
                    <td>{{ $user->name }}</td>
                    <td>{{ $user->email }}</td>
                    <td>{{ $user->course->name ?? 'N/A' }}</td>
                    <td>{{ $user->year }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" style="text-align: center;">No alumni found.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <!-- Footer -->
    <p class="footer">
        Generated on {{ \Carbon\Carbon::now()->format('F j, Y, g:i A') }}
    </p>

</body>
</html>