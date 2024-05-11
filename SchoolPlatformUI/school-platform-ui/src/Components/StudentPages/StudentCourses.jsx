import React from 'react';
import { Card, CardBody, CardTitle, CardText, Button } from 'reactstrap';
import './studentPages.css';

function StudentCourses() {
    const data = [
        { title: "Card 1", description: "This is the first card" },
        { title: "Card 2", description: "This is the second card" },
        { title: "Card 3", description: "This is the third card" },
    ];

    return (
        <div className="container">
            <div className="content"> {/* Container pentru carduri */}
                <h1>Dashboard</h1>
                <div className="card-list">
                    {data.map((item, index) => (
                        <Card key={index} className="card-bordered">
                            <CardBody className="card-inner">
                                <CardTitle tag="h5">{item.title}</CardTitle>
                                <CardText>{item.description}</CardText>
                                <Button color="primary">View course</Button>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default StudentCourses;
